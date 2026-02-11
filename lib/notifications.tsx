import { toast } from 'sonner';
import { ApiError } from './services/api.interceptor';

export function showSuccess(message: string) {
  toast.success(message);
}

export function showError(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        toast.error('Please sign in to continue');
        break;
      case 'FORBIDDEN':
        toast.error('You do not have permission to perform this action');
        break;
      case 'NOT_FOUND':
        toast.error('The requested resource was not found');
        break;
      case 'VALIDATION_ERROR':
        toast.error(error.message || 'Please check your input');
        break;
      case 'NETWORK_ERROR':
        toast.error('Network error. Please check your connection');
        break;
      default:
        toast.error(error.message || 'An error occurred');
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}

export function showInfo(message: string) {
  toast.info(message);
}

export function showWarning(message: string) {
  toast.warning(message);
}

export function showLoading(message: string) {
  return toast.loading(message);
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}
