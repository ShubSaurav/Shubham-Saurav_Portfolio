/**
 * Certificates Configuration - Google Drive Folders
 * Using folder-based approach (no individual file IDs needed!)
 */

export type CertificateFolder = {
  name: string;
  issuer: string;
  category: "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other";
  folderId: string;
  description: string;
};

/**
 * Certificate folders from Google Drive
 * Just add your folder IDs - much easier than individual files!
 */
export const certificateFolders: CertificateFolder[] = [
  {
    name: "LinkedIn Learning Certificates",
    issuer: "LinkedIn Learning",
    category: "linkedin",
    folderId: "1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG",
    description: "Professional development courses and certifications"
  },
  {
    name: "Coursera Certificates",
    issuer: "Coursera",
    category: "coursera",
    folderId: "1LZHUqu3eZX9oahb83-qymJRZMj1fnhEF",
    description: "Online courses and specializations"
  },
  {
    name: "Hackathon Certificates",
    issuer: "Various",
    category: "hackathon",
    folderId: "1k4UhQu7Xx_eBa3df3wJT357pdJj5Jfbc",
    description: "Hackathon participation and awards"
  },
  {
    name: "Workshop Certificates",
    issuer: "Various",
    category: "workshop",
    folderId: "1z0UlO61SBmTf5oxeFJJpoiodiD5AITXp",
    description: "Workshops and training programs"
  },
];

/**
 * Get embedded folder viewer URL
 */
export const getGoogleDriveFolderUrl = (folderId: string): string => {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
};

/**
 * Get folder link URL
 */
export const getGoogleDriveFolderLink = (folderId: string): string => {
  return `https://drive.google.com/drive/folders/${folderId}`;
};

/**
 * For individual certificates (if you add them later)
 */
export type CertificateConfig = {
  title: string;
  issuer: string;
  category: "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other";
  fileId: string;
  date: string;
};

export const individualCertificates: CertificateConfig[] = [
  // Add individual certificates here if needed
];

export const getGoogleDrivePdfUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};
