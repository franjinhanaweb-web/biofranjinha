import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
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
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
      verificationCode: verificationCode,
      preferences: {
        notifications: true,
        theme: 'light'
      }
    };
    
    // Salvar dados adicionais no Firestore
    try {
      await setDoc(doc(db, 'Usuarios_biosite', user.uid), userData);
    } catch (firestoreError: any) {
      // Não falhar o cadastro se o Firestore der erro
      // O usuário já foi criado no Auth
    }
    
    return userData;
  } catch (error: any) {
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
      console.log('Tentando atualizar último login para usuário:', user.uid);
      console.log('Usuário autenticado:', !!auth.currentUser);
      console.log('UID do usuário autenticado:', auth.currentUser?.uid);
      
      // Usar updateDoc em vez de setDoc com merge
      await updateDoc(doc(db, 'Usuarios_biosite', user.uid), {
        lastLoginAt: Timestamp.now()
      });
      
      console.log('Último login atualizado com sucesso!');
    } catch (updateError: any) {
      console.error('Erro ao atualizar último login:', updateError);
      console.error('Código do erro:', updateError.code);
      console.error('Mensagem do erro:', updateError.message);
      // Não falhar o login por causa disso
    }
    
    return userData;
  } catch (error: any) {
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
    console.log('Verificando usuário no Firestore:', user.uid);
    
    // Verificar se usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'Usuarios_biosite', user.uid));
    
    if (userDoc.exists()) {
      console.log('Usuário encontrado no Firestore');
      const data = userDoc.data() as UserData;
      console.log('Dados do usuário:', data);
      return data;
    } else {
      console.log('Usuário não encontrado, criando novo registro');
      // Criar dados do usuário no Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Usuário',
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
        preferences: {
          notifications: true,
          theme: 'light'
        }
      };
      
      console.log('Dados a serem salvos:', userData);
      await setDoc(doc(db, 'Usuarios_biosite', user.uid), userData);
      console.log('Usuário criado no Firestore com sucesso!');
      return userData;
    }
  } catch (error: any) {
    console.error('Erro em ensureUserInFirestore:', error);
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
