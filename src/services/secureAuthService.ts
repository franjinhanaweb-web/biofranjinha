import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  UserCredential,
  updateProfile,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface SecureUserData {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  mfaEnabled: boolean;
  phoneNumber?: string;
  verificationCode?: string;
  preferences?: {
    notifications: boolean;
    theme: string;
  };
  security: {
    lastPasswordChange: Date;
    failedLoginAttempts: number;
    accountLocked: boolean;
    lockoutUntil?: Date;
  };
}

// Configurações de segurança
const SECURITY_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  MIN_PASSWORD_LENGTH: 8,
  REQUIRE_EMAIL_VERIFICATION: true,
  ALLOWED_DOMAINS: ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'], // Configurar conforme necessário
  PASSWORD_POLICY: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};

// Validar política de senha
export const validatePasswordPolicy = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const policy = SECURITY_CONFIG.PASSWORD_POLICY;

  if (password.length < policy.minLength) {
    errors.push(`Senha deve ter pelo menos ${policy.minLength} caracteres`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validar domínio de email
export const validateEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1];
  return SECURITY_CONFIG.ALLOWED_DOMAINS.includes(domain);
};

// Criar usuário com validações de segurança
export const createSecureUser = async (
  email: string, 
  password: string, 
  displayName: string,
  verificationCode?: string
): Promise<SecureUserData> => {
  try {
    // Validar política de senha
    const passwordValidation = validatePasswordPolicy(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Validar domínio de email
    if (!validateEmailDomain(email)) {
      throw new Error('Domínio de email não autorizado');
    }

    // Criar usuário no Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;
    
    // Atualizar perfil do usuário
    await updateProfile(user, {
      displayName: displayName
    });

    // Enviar email de verificação
    if (SECURITY_CONFIG.REQUIRE_EMAIL_VERIFICATION) {
      await sendEmailVerification(user);
    }
    
    // Dados do usuário para salvar no Firestore
    const userData: SecureUserData = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      mfaEnabled: false,
      verificationCode: verificationCode,
      preferences: {
        notifications: true,
        theme: 'light'
      },
      security: {
        lastPasswordChange: new Date(),
        failedLoginAttempts: 0,
        accountLocked: false
      }
    };
    
    // Salvar dados no Firestore
    await setDoc(doc(db, 'users_site', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      'security.lastPasswordChange': serverTimestamp()
    });
    
    return userData;
  } catch (error: any) {
    throw new Error(getSecureErrorMessage(error.code));
  }
};

// Login seguro com verificações
export const secureSignIn = async (
  email: string, 
  password: string
): Promise<SecureUserData> => {
  try {
    // Verificar se conta está bloqueada
    const userDoc = await getDoc(doc(db, 'users_site', email));
    if (userDoc.exists()) {
      const userData = userDoc.data() as SecureUserData;
      if (userData.security.accountLocked) {
        const lockoutUntil = userData.security.lockoutUntil;
        if (lockoutUntil && new Date() < new Date(lockoutUntil)) {
          throw new Error('Conta temporariamente bloqueada devido a tentativas de login falhadas');
        }
      }
    }

    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;
    
    // Verificar se email foi verificado
    if (SECURITY_CONFIG.REQUIRE_EMAIL_VERIFICATION && !user.emailVerified) {
      await signOut(auth);
      throw new Error('Email não verificado. Verifique sua caixa de entrada');
    }

    // Resetar tentativas de login falhadas
    await updateDoc(doc(db, 'users_site', user.uid), {
      'security.failedLoginAttempts': 0,
      'security.accountLocked': false,
      'security.lockoutUntil': null,
      lastLoginAt: serverTimestamp()
    });
    
    // Obter dados do usuário
    const userData = await ensureSecureUserInFirestore(user);
    
    return userData;
  } catch (error: any) {
    // Incrementar tentativas de login falhadas
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      await handleFailedLoginAttempt(email);
    }
    throw new Error(getSecureErrorMessage(error.code));
  }
};

// Lidar com tentativas de login falhadas
const handleFailedLoginAttempt = async (email: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users_site', email));
    if (userDoc.exists()) {
      const userData = userDoc.data() as SecureUserData;
      const newFailedAttempts = (userData.security.failedLoginAttempts || 0) + 1;
      
      if (newFailedAttempts >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS) {
        // Bloquear conta
        const lockoutUntil = new Date();
        lockoutUntil.setMinutes(lockoutUntil.getMinutes() + SECURITY_CONFIG.LOCKOUT_DURATION_MINUTES);
        
        await updateDoc(doc(db, 'users_site', userData.uid), {
          'security.failedLoginAttempts': newFailedAttempts,
          'security.accountLocked': true,
          'security.lockoutUntil': lockoutUntil
        });
      } else {
        await updateDoc(doc(db, 'users_site', userData.uid), {
          'security.failedLoginAttempts': newFailedAttempts
        });
      }
    }
  } catch (error) {
    // Não falhar o login por causa disso
    console.error('Erro ao atualizar tentativas de login:', error);
  }
};

// Configurar MFA (Multi-Factor Authentication)
export const setupMFA = async (phoneNumber: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const multiFactorSession = await multiFactor(user).getSession();
    const phoneAuthCredential = PhoneAuthProvider.credential(phoneNumber, 'verification-id');
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
    
    await multiFactor(user).enroll(multiFactorAssertion, 'Phone Number');
    
    // Atualizar dados do usuário
    await updateDoc(doc(db, 'users_site', user.uid), {
      mfaEnabled: true,
      phoneNumber: phoneNumber
    });
  } catch (error: any) {
    throw new Error('Erro ao configurar autenticação de dois fatores');
  }
};

// Verificar e criar usuário no Firestore com dados de segurança
export const ensureSecureUserInFirestore = async (user: User): Promise<SecureUserData> => {
  try {
    const userDoc = await getDoc(doc(db, 'users_site', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as SecureUserData;
    } else {
      // Criar dados do usuário com configurações de segurança
      const userData: SecureUserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Usuário',
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        mfaEnabled: false,
        preferences: {
          notifications: true,
          theme: 'light'
        },
        security: {
          lastPasswordChange: new Date(),
          failedLoginAttempts: 0,
          accountLocked: false
        }
      };
      
      await setDoc(doc(db, 'users_site', user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        'security.lastPasswordChange': serverTimestamp()
      });
      
      return userData;
    }
  } catch (error: any) {
    throw error;
  }
};

// Alterar senha com reautenticação
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Usuário não autenticado');

  try {
    // Validar nova senha
    const passwordValidation = validatePasswordPolicy(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Reautenticar usuário
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Atualizar senha
    await updatePassword(user, newPassword);

    // Atualizar timestamp da última alteração de senha
    await updateDoc(doc(db, 'users_site', user.uid), {
      'security.lastPasswordChange': serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(getSecureErrorMessage(error.code));
  }
};

// Converter códigos de erro para mensagens em português
const getSecureErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este email já está sendo usado por outra conta.';
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/operation-not-allowed':
      return 'Operação não permitida.';
    case 'auth/weak-password':
      return 'A senha não atende aos critérios de segurança.';
    case 'auth/user-disabled':
      return 'Esta conta foi desabilitada.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet.';
    case 'auth/requires-recent-login':
      return 'Esta operação requer login recente. Faça login novamente.';
    case 'auth/email-not-verified':
      return 'Email não verificado. Verifique sua caixa de entrada.';
    default:
      return 'Erro de segurança. Tente novamente.';
  }
};

// Exportar configurações de segurança
export { SECURITY_CONFIG };
