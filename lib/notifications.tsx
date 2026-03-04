import { toast } from 'sonner';
import { APIError } from './services/api.client';

type ToastEntry = { title: string; description?: string };

function resolveAPIError(error: APIError): ToastEntry {
  switch (error.code) {
    // Network & Infrastructure
    case 'NETWORK_ERROR':
      return { title: 'Connection Error', description: 'Cannot reach the server. Check your internet connection.' };
    case 'TIMEOUT':
      return { title: 'Request Timed Out', description: 'The server took too long to respond. Please try again.' };
    case 'RATE_LIMITED':
      return { title: 'Too Many Requests', description: 'Please wait a moment before trying again.' };

    // Authentication & Authorization
    case 'UNAUTHORIZED':
      return { title: 'Sign In Required', description: 'Please sign in to continue.' };
    case 'FORBIDDEN':
      return { title: 'Access Denied', description: "You don't have permission to do this." };
    case 'INVALID_CREDENTIALS':
      return { title: 'Invalid Login', description: 'Email or password is incorrect.' };
    case 'EMAIL_NOT_CONFIRMED':
      return { title: 'Email Not Confirmed', description: 'Please check your email and confirm your account.' };
    case 'WEAK_PASSWORD':
      return { title: 'Weak Password', description: 'Password must be at least 8 characters long.' };

    // Kitchen & Business
    case 'INVALID_CERTIFICATE':
      return { title: 'Invalid Certificate', description: 'Food handler certificate is invalid or expired.' };
    case 'MISSING_DOCUMENTS':
      return { title: 'Missing Documents', description: 'Required verification documents are missing.' };
    case 'KITCHEN_NOT_FOUND':
      return { title: 'Kitchen Not Found', description: 'This kitchen no longer exists.' };
    case 'KITCHEN_INACTIVE':
      return { title: 'Kitchen Closed', description: 'This kitchen is not accepting orders right now.' };
    case 'DUPLICATE_KITCHEN':
      return { title: 'Duplicate Kitchen', description: 'A kitchen with this name already exists.' };

    // Orders
    case 'MINIMUM_ORDER_NOT_MET':
      return { title: 'Minimum Order Not Met', description: error.message || 'Order total is below minimum.' };
    case 'ITEM_UNAVAILABLE':
      return { title: 'Item Unavailable', description: 'One or more items are no longer available.' };
    case 'INVALID_PICKUP_TIME':
      return { title: 'Invalid Time', description: 'Please select a valid pickup time.' };
    case 'KITCHEN_CLOSED':
      return { title: 'Kitchen Closed', description: 'Kitchen is currently closed. Please check operating hours.' };

    // Payment
    case 'PAYMENT_FAILED':
      return { title: 'Payment Failed', description: 'Payment could not be processed. Please try again.' };
    case 'INVALID_PAYMENT_METHOD':
      return { title: 'Invalid Payment', description: 'Selected payment method is not accepted.' };

    // Generic
    case 'VALIDATION_ERROR':
      return { title: 'Invalid Input', description: error.message || 'Please check your input.' };
    case 'CONFLICT':
    case 'EMAIL_ALREADY_EXISTS':
      return { title: 'Already Registered', description: error.message || 'This email is already in use.' };
    case 'NOT_FOUND':
      return { title: 'Not Found', description: error.message || 'The requested resource was not found.' };
    case 'INVALID_ADDRESS':
      return { title: 'Invalid Address', description: 'Address could not be verified.' };
    case 'DATABASE_ERROR':
      return { title: 'Database Error', description: 'An error occurred. Please try again later.' };
    case 'SERVER_ERROR':
    case 'INTERNAL_ERROR':
      return { title: 'Server Error', description: 'Something went wrong. Please try again later.' };
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
