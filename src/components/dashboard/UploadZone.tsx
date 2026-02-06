import React, { useCallback, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
  children: React.ReactNode;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, isUploading, children }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set inactive if we're leaving the drop zone entirely
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
    // Reset input
    e.target.value = '';
  }, [onUpload]);

  return (
    <div
      className="relative min-h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {/* Upload input (hidden) */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        onChange={handleFileInput}
      />

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg">
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Drop files to upload
            </h3>
            <p className="text-muted-foreground">
              Release to upload your files
            </p>
          </div>
        </div>
      )}

      {/* Upload progress overlay */}
      {isUploading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center animate-fade-in">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Uploading files...
            </h3>
            <p className="text-muted-foreground">
              Please wait while your files are being uploaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
