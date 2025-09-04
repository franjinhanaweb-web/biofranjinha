import { doc, updateDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface VerificationCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string; // UID do usuário que usou o código
  usedAt?: Date;
  createdAt: Date;
}

export interface CodeValidationResult {
  isValid: boolean;
  isUsed: boolean;
  message: string;
  codeData?: VerificationCode;
}

// Validar se um código existe e está disponível
export const validateVerificationCode = async (code: string): Promise<CodeValidationResult> => {
  try {
    // Validar formato UUID (36 caracteres com hífens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!code || code.length !== 36 || !uuidRegex.test(code)) {
      return {
        isValid: false,
        isUsed: false,
        message: 'Código deve ter formato UUID válido (36 caracteres)'
      };
    }

    // Buscar o código na coleção users_codes
    const codesRef = collection(db, 'users_codes');
    const q = query(codesRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        isValid: false,
        isUsed: false,
        message: 'Código de verificação não encontrado'
      };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = { id: codeDoc.id, ...codeDoc.data() } as VerificationCode;

    if (codeData.isUsed) {
      return {
        isValid: false,
        isUsed: true,
        message: 'Este código já foi utilizado',
        codeData
      };
    }

    return {
      isValid: true,
      isUsed: false,
      message: 'Código válido e pronto para uso',
      codeData
    };

  } catch (error) {
    console.error('Erro ao validar código:', error);
    return {
      isValid: false,
      isUsed: false,
      message: 'Erro ao validar código. Tente novamente.'
    };
  }
};

// Marcar código como usado
export const markCodeAsUsed = async (codeId: string, userId: string): Promise<void> => {
  try {
    const codeRef = doc(db, 'users_codes', codeId);
    await updateDoc(codeRef, {
      isUsed: true,
      usedBy: userId,
      usedAt: new Date()
    });
    console.log('Código marcado como usado com sucesso');
  } catch (error) {
    console.error('Erro ao marcar código como usado:', error);
    throw new Error('Erro ao processar código de verificação');
  }
};

// Verificar se um usuário já usou algum código
export const checkUserHasUsedCode = async (userId: string): Promise<boolean> => {
  try {
    const codesRef = collection(db, 'users_codes');
    const q = query(codesRef, where('usedBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar se usuário usou código:', error);
    return false;
  }
};

// Obter código usado por um usuário
export const getUserUsedCode = async (userId: string): Promise<VerificationCode | null> => {
  try {
    const codesRef = collection(db, 'users_codes');
    const q = query(codesRef, where('usedBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const codeDoc = querySnapshot.docs[0];
    return { id: codeDoc.id, ...codeDoc.data() } as VerificationCode;
  } catch (error) {
    console.error('Erro ao obter código usado pelo usuário:', error);
    return null;
  }
};
