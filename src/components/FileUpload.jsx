import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile, validateFile, compressImage } from '../lib/storage';

/**
 * Reusable File Upload Component
 * Supports single/multiple files, image compression, validation, and progress tracking
 */
export default function FileUpload({
  onUploadComplete,
  onUploadError,
  storagePath,
  accept = 'image/*,application/pdf',
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  compressImages = true,
  label = 'Upload Files',
  description = 'Drag and drop files here or click to browse',
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validatedFiles = newFiles.map((file) => {
      const validation = validateFile(file, {
        maxSize,
        allowedTypes: accept.split(',').map((t) => t.trim()),
      });

      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        valid: validation.valid,
        error: validation.error,
        progress: 0,
        status: 'pending', // pending, uploading, success, error
        url: null,
      };
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validatedFiles]);
    } else {
      setFiles(validatedFiles);
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFiles = async () => {
    setUploading(true);

    try {
      const uploadPromises = files
        .filter((f) => f.valid && f.status === 'pending')
        .map(async (fileItem) => {
          try {
            // Update status to uploading
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id ? { ...f, status: 'uploading' } : f
              )
            );

            let fileToUpload = fileItem.file;

            // Compress image if enabled
            if (compressImages && fileItem.type.startsWith('image/')) {
              const compressed = await compressImage(fileItem.file);
              fileToUpload = new File([compressed], fileItem.name, {
                type: fileItem.type,
              });
            }

            // Upload file
            const fileName = `${Date.now()}_${fileItem.name}`;
            const fullPath = `${storagePath}/${fileName}`;

            const url = await uploadFile(fileToUpload, fullPath, (progress) => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileItem.id ? { ...f, progress } : f
                )
              );
            });

            // Update status to success
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id
                  ? { ...f, status: 'success', url, progress: 100 }
                  : f
              )
            );

            return { id: fileItem.id, url, name: fileItem.name };
          } catch (error) {
            // Update status to error
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id
                  ? { ...f, status: 'error', error: error.message }
                  : f
              )
            );
            throw error;
          }
        });

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      if (successfulUploads.length > 0) {
        onUploadComplete(successfulUploads);
      }

      const failedUploads = results.filter((r) => r.status === 'rejected');
      if (failedUploads.length > 0 && onUploadError) {
        onUploadError(failedUploads.map((r) => r.reason));
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const getStatusIcon = (status) => {
    if (status === 'success') return CheckCircle;
    if (status === 'error') return AlertCircle;
    return null;
  };

  const getStatusColor = (status) => {
    if (status === 'success') return 'text-teal bg-teal-light';
    if (status === 'error') return 'text-red-500 bg-red-100';
    if (status === 'uploading') return 'text-amber-dark bg-amber-light';
    return 'text-muted bg-warm';
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-ink">{label}</label>
      )}

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-teal bg-teal-light'
            : 'border-gray-200 hover:border-teal/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
        <p className="text-ink font-medium mb-1">{description}</p>
        <p className="text-muted text-sm mb-4">
          {accept.includes('image') && 'Images'}{' '}
          {accept.includes('pdf') && 'PDFs'} up to {formatFileSize(maxSize)}
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 rounded-lg bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
        >
          Browse Files
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileItem) => {
            const FileIcon = getFileIcon(fileItem.type);
            const StatusIcon = getStatusIcon(fileItem.status);

            return (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white"
              >
                {/* Preview or Icon */}
                {fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-sand flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-muted" />
                  </div>
                )}

                {/* File Info */}
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {fileItem.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatFileSize(fileItem.size)}
                  </p>

                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal transition-all duration-300"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {Math.round(fileItem.progress)}%
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {fileItem.error && (
                    <p className="text-xs text-red-500 mt-1">{fileItem.error}</p>
                  )}
                </div>

                {/* Status Icon */}
                {StatusIcon && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                      fileItem.status
                    )}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </div>
                )}

                {/* Remove Button */}
                {fileItem.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => removeFile(fileItem.id)}
                    className="p-2 rounded-lg hover:bg-sand transition-colors"
                  >
                    <X className="w-4 h-4 text-muted" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && files.some((f) => f.status === 'pending') && (
        <button
          type="button"
          onClick={uploadFiles}
          disabled={uploading || files.every((f) => !f.valid)}
          className="w-full py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  );
}
