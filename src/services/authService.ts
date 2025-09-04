import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
  verificationCode?: string; // Código de verificação usado no cadastro
  preferences?: {
    notifications: boolean;
    theme: string;
  };
}

// Criar usuário no Firebase Auth e salvar dados no Firestore
export const createUser = async (
  email: string, 
  password: string, 
  displayName: string,
  verificationCode?: string
): Promise<UserData> => {
  try {
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
    
    // Dados do usuário para salvar no Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      verificationCode: verificationCode,
      preferences: {
        notifications: true,
        theme: 'light'
      }
    };
    
    // Salvar dados adicionais no Firestore
    try {
      await setDoc(doc(db, 'users_site', user.uid), userData);
      console.log('Usuário salvo no Firestore com sucesso');
    } catch (firestoreError: any) {
      console.error('Erro ao salvar no Firestore:', firestoreError);
      // Não falhar o cadastro se o Firestore der erro
      // O usuário já foi criado no Auth
    }
    
    return userData;
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Fazer login do usuário
export const signInUser = async (
  email: string, 
  password: string
): Promise<UserData> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;
    
    // Verificar e criar usuário no Firestore se necessário
    const userData = await ensureUserInFirestore(user);
    
    // Atualizar último login
    try {
      await setDoc(doc(db, 'users_site', user.uid), {
        ...userData,
        lastLoginAt: new Date()
      }, { merge: true });
    } catch (updateError) {
      console.error('Erro ao atualizar último login:', updateError);
      // Não falhar o login por causa disso
    }
    
    return userData;
  } catch (error: any) {
    console.error('Erro no login:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Fazer logout do usuário
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Erro ao fazer logout');
  }
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Verificar e criar usuário no Firestore se não existir
export const ensureUserInFirestore = async (user: User): Promise<UserData> => {
  try {
    // Verificar se usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'users_site', user.uid));
    
    if (userDoc.exists()) {
      console.log('Usuário já existe no Firestore');
      return userDoc.data() as UserData;
    } else {
      // Criar dados do usuário no Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Usuário',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          notifications: true,
          theme: 'light'
        }
      };
      
      await setDoc(doc(db, 'users_site', user.uid), userData);
      console.log('Usuário criado no Firestore com sucesso');
      return userData;
    }
  } catch (error: any) {
    console.error('Erro ao verificar/criar usuário no Firestore:', error);
    throw error;
  }
};

// Converter códigos de erro do Firebase para mensagens em português
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este email já está sendo usado por outra conta.';
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/operation-not-allowed':
      return 'Operação não permitida.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
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
    default:
      return 'Erro desconhecido. Tente novamente.';
  }
};
