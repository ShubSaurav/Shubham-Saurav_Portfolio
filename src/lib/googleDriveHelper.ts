/**
 * Google Drive Helper Utilities
 * Provides functions for displaying and managing Google Drive hosted certificates
 */

export interface GoogleDriveCertificate {
  fileId: string;
  title: string;
  isDocument?: boolean;
}

/**
 * Generate a preview URL for a Google Drive file
 * Works for PDFs, images, and documents
 */
export const getGoogleDrivePreviewUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Generate a download URL for a Google Drive file
 */
export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Generate a thumbnail URL for a Google Drive file
 * Note: This requires the file to be publicly accessible
 */
export const getGoogleDriveThumbnailUrl = (fileId: string, size = 200): string => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
};

/**
 * Check if a Google Drive link is valid
 */
export const isValidGoogleDriveFileId = (fileId: string): boolean => {
  // Google Drive file IDs are typically 33 characters long
  return /^[a-zA-Z0-9_-]{33}$/.test(fileId);
};

/**
 * Extract file ID from a Google Drive URL
 */
export const extractFileIdFromUrl = (url: string): string | null => {
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]{33})\//,  // https://drive.google.com/file/d/ID/view
    /id=([a-zA-Z0-9_-]{33})/,      // ?id=ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

/**
 * Generate an embed iframe for Google Drive PDF
 */
export const getGoogleDriveEmbedCode = (
  fileId: string,
  width = "100%",
  height = "600px"
): string => {
  return `<iframe src="https://drive.google.com/file/d/${fileId}/preview" width="${width}" height="${height}" allow="autoplay"></iframe>`;
};
