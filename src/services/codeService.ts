import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface CodeData {
  code: string;
  isUsed: boolean;
  createdAt?: any;
  usedAt?: any;
  usedBy?: string;
}

export interface CodeValidationResult {
  isValid: boolean;
  codeId?: string;
  error?: string;
}

/**
 * Valida se um código existe e está disponível para uso
 */
export const validateCode = async (code: string): Promise<CodeValidationResult> => {
  try {
    const codesRef = collection(db, 'Codes_bioSite');
    const q = query(codesRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        isValid: false,
        error: 'Código não encontrado'
      };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = codeDoc.data() as CodeData;

    if (codeData.isUsed) {
      return {
        isValid: false,
        error: 'Código já foi utilizado'
      };
    }

    return {
      isValid: true,
      codeId: codeDoc.id
    };
  } catch (error: any) {
    console.error('Erro ao validar código:', error);
    return {
      isValid: false,
      error: 'Erro interno ao validar código'
    };
  }
};

/**
 * Marca um código como usado
 */
export const markCodeAsUsed = async (codeId: string, userId: string): Promise<boolean> => {
  try {
    const codeRef = doc(db, 'Codes_bioSite', codeId);
    await updateDoc(codeRef, {
      isUsed: true,
      usedAt: serverTimestamp(),
      usedBy: userId
    });
    return true;
  } catch (error: any) {
    console.error('Erro ao marcar código como usado:', error);
    return false;
  }
};

/**
 * Valida e marca um código como usado em uma operação atômica
 */
export const validateAndUseCode = async (code: string, userId: string): Promise<CodeValidationResult> => {
  try {
    // Primeiro valida o código
    const validation = await validateCode(code);
    
    if (!validation.isValid) {
      return validation;
    }

    // Se válido, marca como usado
    const success = await markCodeAsUsed(validation.codeId!, userId);
    
    if (!success) {
      return {
        isValid: false,
        error: 'Erro ao marcar código como usado'
      };
    }

    return {
      isValid: true,
      codeId: validation.codeId
    };
  } catch (error: any) {
    console.error('Erro ao validar e usar código:', error);
    return {
      isValid: false,
      error: 'Erro interno ao processar código'
    };
  }
};

/**
 * Busca todos os códigos (para administração)
 */
export const getAllCodes = async (): Promise<CodeData[]> => {
  try {
    const codesRef = collection(db, 'Codes_bioSite');
    const querySnapshot = await getDocs(codesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CodeData & { id: string }));
  } catch (error: any) {
    console.error('Erro ao buscar códigos:', error);
    return [];
  }
};

/**
 * Busca códigos por status (usados/não usados)
 */
export const getCodesByStatus = async (isUsed: boolean): Promise<CodeData[]> => {
  try {
    const codesRef = collection(db, 'Codes_bioSite');
    const q = query(codesRef, where('isUsed', '==', isUsed));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CodeData & { id: string }));
  } catch (error: any) {
    console.error('Erro ao buscar códigos por status:', error);
    return [];
  }
};
