import { toast } from 'sonner';

export function useToast() {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
