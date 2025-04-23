import { ChangeEvent, useCallback, useState } from 'react';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { showError } from '@/lib/utils/notifications';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  value?: File | null;
  allowedTypes?: string[];
}

export function FileUpload({
  accept = '*/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  onFileRemove,
  label = 'Upload file',
  helperText,
  error,
  className,
  value,
  allowedTypes,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      showError(`File size must be less than ${formatFileSize(maxSize)}`);
      return false;
    }

    // Check file type if specified
    if (allowedTypes && allowedTypes.length > 0) {
      const fileType = file.type || '';
      if (!allowedTypes.some(type => fileType.startsWith(type))) {
        showError(`File type must be one of: ${allowedTypes.join(', ')}`);
        return false;
      }
    }

    return true;
  }, [maxSize, allowedTypes]);

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-6 transition-colors',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          error && 'border-error hover:border-error',
          value && 'border-success hover:border-success'
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {value ? (
            <div className="flex items-center space-x-2">
              <DocumentIcon className="h-8 w-8 text-success" />
              <div className="flex-1 text-sm">
                <p className="font-medium">{value.name}</p>
                <p className="text-muted-foreground">
                  {formatFileSize(value.size)}
                </p>
              </div>
              {onFileRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onFileRemove();
                  }}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <XMarkIcon className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <DocumentIcon className="h-8 w-8" />
                <span className="text-sm font-medium">
                  Drag & drop or click to upload
                </span>
              </div>
              {helperText && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}