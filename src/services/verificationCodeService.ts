import { doc, updateDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface VerificationCode {
  id: string;
  code: string;
  isUsed: boolean | string; // Pode ser boolean ou string (do Firebase)
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
        message: 'Código de verificação não encontrado no banco de dados'
      };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = { id: codeDoc.id, ...codeDoc.data() } as VerificationCode;

    // Converter isUsed para boolean (caso seja string)
    const isUsedBoolean = codeData.isUsed === true || codeData.isUsed === 'true';

    if (isUsedBoolean) {
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
      isUsed: true
    });
  } catch (error) {
    throw new Error('Erro ao processar código de verificação');
  }
};

