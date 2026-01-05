import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to target size (default 25KB) for e-commerce product images
 * Based on Fashion and Friends standards: ~25KB, 450-600px dimensions
 *
 * @param {File} imageFile - The original image file from input
 * @param {number} maxSizeKB - Target max size in KB (default: 25)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressProductImage = async (imageFile, maxSizeKB = 25) => {
  try {
    // Configuration optimized for e-commerce product images
    const options = {
      maxSizeMB: maxSizeKB / 1000,      // Convert KB to MB (25KB = 0.025MB)
      maxWidthOrHeight: 800,             // Max dimension (covers 450-600px range)
      useWebWorker: true,                // Better performance
      initialQuality: 0.8,               // Start with good quality
      fileType: 'image/jpeg',            // JPEG has best compression
    };

    console.log(`Original file size: ${(imageFile.size / 1024).toFixed(2)} KB`);

    // Compress the image
    const compressedFile = await imageCompression(imageFile, options);

    console.log(`Compressed file size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image. Please try a different image.');
  }
};

/**
 * Compresses multiple image files
 *
 * @param {File[]} imageFiles - Array of image files
 * @param {number} maxSizeKB - Target max size in KB (default: 25)
 * @returns {Promise<File[]>} - Array of compressed image files
 */
export const compressMultipleImages = async (imageFiles, maxSizeKB = 25) => {
  try {
    const compressionPromises = imageFiles.map(file =>
      compressProductImage(file, maxSizeKB)
    );

    return await Promise.all(compressionPromises);
  } catch (error) {
    console.error('Error compressing multiple images:', error);
    throw new Error('Failed to compress images. Please try again.');
  }
};
