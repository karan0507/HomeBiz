import { toast } from 'sonner';
import { APIError } from './services/api.client';

type ToastEntry = { title: string; description?: string };

function resolveAPIError(error: APIError): ToastEntry {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return { title: 'Connection Error', description: 'Cannot reach the server. Check your internet connection.' };
    case 'UNAUTHORIZED':
      return { title: 'Sign In Required', description: 'Please sign in to continue.' };
    case 'FORBIDDEN':
      return { title: 'Access Denied', description: "You don't have permission to do this." };
    case 'VALIDATION_ERROR':
      return { title: 'Invalid Input', description: error.message || 'Please check your input.' };
    case 'CONFLICT':
      return { title: 'Already Registered', description: error.message || 'This resource already exists.' };
    case 'NOT_FOUND':
      return { title: 'Not Found', description: error.message || 'The requested resource was not found.' };
    case 'SERVER_ERROR':
      return { title: 'Server Error', description: 'Something went wrong. Please try again later.' };
    case 'RATE_LIMITED':
      return { title: 'Too Many Requests', description: 'Please wait a moment before trying again.' };
    case 'SERVICE_UNAVAILABLE':
      return { title: 'Service Unavailable', description: 'The service is temporarily down. Please try again shortly.' };
    case 'MOCK_MODE':
      return { title: 'Dev Mode', description: 'Backend is disabled — using mock data.' };
    default:
      return { title: 'Error', description: error.message || 'An unexpected error occurred.' };
  }
}

export function showError(error: unknown) {
  if (error instanceof APIError) {
    const { title, description } = resolveAPIError(error);
    toast.error(title, { description, duration: 6000 });
  } else if (error instanceof Error) {
    toast.error('Error', { description: error.message, duration: 6000 });
  } else {
    toast.error('Unexpected Error', { description: 'Please try again.', duration: 6000 });
  }
}

export function showSuccess(title: string, description?: string) {
  toast.success(title, { description, duration: 3000 });
}

export function showInfo(title: string, description?: string) {
  toast.info(title, { description, duration: 4000 });
}

export function showWarning(title: string, description?: string) {
  toast.warning(title, { description, duration: 5000 });
}

export function showLoading(message: string) {
  return toast.loading(message);
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}
