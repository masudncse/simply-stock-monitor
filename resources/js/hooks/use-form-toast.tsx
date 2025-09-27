import { useToast } from '@/contexts/ToastContext';

export function useFormToast() {
  const { success, error } = useToast();

  const handleSuccess = (message: string = 'Operation completed successfully') => {
    success('Success', message);
  };

  const handleError = (message: string = 'An error occurred') => {
    error('Error', message);
  };

  const createFormHandlers = (successMessage?: string, errorMessage?: string) => ({
    onSuccess: () => handleSuccess(successMessage),
    onError: () => handleError(errorMessage),
  });

  return {
    handleSuccess,
    handleError,
    createFormHandlers,
    success,
    error,
  };
}
