import { useState } from 'react';
import { validateCode, validateAndUseCode, CodeValidationResult } from '../services/codeService';

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
      const result = await validateCode(code);
      setValidationResult(result);
      return result;
    } catch (error: any) {
      const errorResult: CodeValidationResult = {
        isValid: false,
        error: 'Erro inesperado ao validar código'
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
      const result = await validateAndUseCode(code, userId);
      setValidationResult(result);
      return result;
    } catch (error: any) {
      const errorResult: CodeValidationResult = {
        isValid: false,
        error: 'Erro inesperado ao processar código'
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
