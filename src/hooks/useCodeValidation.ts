import { useState } from 'react';
import { validateVerificationCode, markCodeAsUsed, CodeValidationResult } from '../services/verificationCodeService';

export interface UseCodeValidationReturn {
  isValidating: boolean;
  validationResult: CodeValidationResult | null;
  validateCodeAsync: (code: string) => Promise<CodeValidationResult>;
  validateAndUseCodeAsync: (code: string, userId: string) => Promise<CodeValidationResult>;
  clearValidation: () => void;
}

export const useCodeValidation = (): UseCodeValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CodeValidationResult | null>(null);

  const validateCodeAsync = async (code: string): Promise<CodeValidationResult> => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await validateVerificationCode(code);
      setValidationResult(result);
      return result;
    } catch (error: any) {
      const errorResult: CodeValidationResult = {
        isValid: false,
        isUsed: false,
        message: 'Erro inesperado ao validar código'
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  };

  const validateAndUseCodeAsync = async (code: string, userId: string): Promise<CodeValidationResult> => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      // Primeiro validar o código
      const validation = await validateVerificationCode(code);
      
      if (!validation.isValid) {
        setValidationResult(validation);
        return validation;
      }

      // Se válido, marcar como usado
      if (validation.codeData) {
        await markCodeAsUsed(validation.codeData.id, userId);
        const result: CodeValidationResult = {
          isValid: true,
          isUsed: false,
          message: 'Código validado e marcado como usado com sucesso',
          codeData: validation.codeData
        };
        setValidationResult(result);
        return result;
      } else {
        const errorResult: CodeValidationResult = {
          isValid: false,
          isUsed: false,
          message: 'Erro ao processar código de verificação'
        };
        setValidationResult(errorResult);
        return errorResult;
      }
    } catch (error: any) {
      const errorResult: CodeValidationResult = {
        isValid: false,
        isUsed: false,
        message: 'Erro inesperado ao processar código'
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  };

  const clearValidation = () => {
    setValidationResult(null);
  };

  return {
    isValidating,
    validationResult,
    validateCodeAsync,
    validateAndUseCodeAsync,
    clearValidation
  };
};
