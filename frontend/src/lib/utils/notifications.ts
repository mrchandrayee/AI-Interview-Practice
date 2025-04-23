import Swal from 'sweetalert2';

// Base configurations for different notification types
const baseConfig = {
  confirmButtonColor: '#4F46E5', // primary color
  cancelButtonColor: '#6B7280', // gray-500
  reverseButtons: true,
};

// Success notification
export const showSuccess = (message: string, title = 'Success') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text: message,
    icon: 'success',
    timer: 3000,
    timerProgressBar: true,
  });
};

// Error notification
export const showError = (message: string, title = 'Error') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text: message,
    icon: 'error',
  });
};

// Warning notification
export const showWarning = (message: string, title = 'Warning') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text: message,
    icon: 'warning',
  });
};

// Info notification
export const showInfo = (message: string, title = 'Info') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text: message,
    icon: 'info',
  });
};

// Confirmation dialog
export const showConfirm = async (
  message: string,
  title = 'Are you sure?',
  options?: {
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDangerous?: boolean;
  }
) => {
  const result = await Swal.fire({
    ...baseConfig,
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: options?.confirmButtonText || 'Yes',
    cancelButtonText: options?.cancelButtonText || 'Cancel',
    confirmButtonColor: options?.isDangerous ? '#EF4444' : baseConfig.confirmButtonColor,
  });

  return result.isConfirmed;
};

// Loading state
export const showLoading = (message = 'Please wait...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading state or any active notification
export const closeNotification = () => {
  Swal.close();
};

// Input dialog
export const showPrompt = async (
  message: string,
  title = 'Input Required',
  options?: {
    defaultValue?: string;
    placeholder?: string;
    validationMessage?: string;
  }
) => {
  const result = await Swal.fire({
    ...baseConfig,
    title,
    text: message,
    input: 'text',
    inputValue: options?.defaultValue || '',
    inputPlaceholder: options?.placeholder || '',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return options?.validationMessage || 'This field is required';
      }
      return null;
    },
  });

  return result.value;
};

// Examples of usage:
/*
// Show success message
showSuccess('Your profile has been updated successfully');

// Show error message
showError('Failed to save changes. Please try again.');

// Show loading state
const loading = showLoading('Uploading file...');
// ... do something
loading.close();

// Confirm action
if (await showConfirm('This action cannot be undone', 'Delete Account?', {
  confirmButtonText: 'Yes, delete my account',
  isDangerous: true,
})) {
  // Proceed with deletion
}

// Get user input
const name = await showPrompt('What is your name?', 'User Input', {
  placeholder: 'Enter your name',
  validationMessage: 'Name is required',
});
*/