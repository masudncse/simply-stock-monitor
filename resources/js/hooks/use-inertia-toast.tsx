import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/contexts/ToastContext';

export function useInertiaToast() {
  const { props } = usePage();
  const { success, error, warning } = useToast();

  useEffect(() => {
    // Check for flash messages from Laravel
    if (props.flash) {
      if (props.flash.success) {
        success('Success', props.flash.success);
      }
      if (props.flash.error) {
        error('Error', props.flash.error);
      }
      if (props.flash.warning) {
        warning('Warning', props.flash.warning);
      }
    }

    // Check for validation errors
    if (props.errors && Object.keys(props.errors).length > 0) {
      const firstError = Object.values(props.errors)[0];
      error('Validation Error', Array.isArray(firstError) ? firstError[0] : firstError);
    }
  }, [props.flash, props.errors, success, error, warning]);
}