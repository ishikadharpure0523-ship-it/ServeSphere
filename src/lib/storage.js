import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseAuth } from './firebase';

const storage = getStorage();

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'users/uid/profile.jpg')
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<string>} - Download URL
 */
export const uploadFile = (file, path, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} basePath - Base storage path
 * @param {Function} onProgress - Progress callback for each file
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleFiles = async (files, basePath, onProgress = null) => {
  const uploadPromises = files.map((file, index) => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${basePath}/${fileName}`;
    
    return uploadFile(file, filePath, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete a file from Firebase Storage
 * @param {string} url - The download URL or path
 * @returns {Promise<void>}
 */
export const deleteFile = async (url) => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

/**
 * Upload profile image
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} - Download URL
 */
export const uploadProfileImage = async (file, userId, onProgress = null) => {
  const path = `users/${userId}/profile-image.jpg`;
  return uploadFile(file, path, onProgress);
};

/**
 * Upload verification documents for NGOs
 * @param {File[]} files - Document files
 * @param {string} ngoId - NGO ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadVerificationDocs = async (files, ngoId, onProgress = null) => {
  const basePath = `ngos/${ngoId}/verification`;
  return uploadMultipleFiles(files, basePath, onProgress);
};

/**
 * Upload project photos for NGOs
 * @param {File[]} files - Photo files
 * @param {string} ngoId - NGO ID
 * @param {string} projectId - Project ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadProjectPhotos = async (files, ngoId, projectId, onProgress = null) => {
  const basePath = `ngos/${ngoId}/projects/${projectId}/photos`;
  return uploadMultipleFiles(files, basePath, onProgress);
};

/**
 * Upload bills/receipts for transparency
 * @param {File[]} files - Bill files
 * @param {string} ngoId - NGO ID
 * @param {string} projectId - Project ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadBills = async (files, ngoId, projectId, onProgress = null) => {
  const basePath = `ngos/${ngoId}/projects/${projectId}/bills`;
  return uploadMultipleFiles(files, basePath, onProgress);
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Compress image before upload
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};
