/**
 * LinkedIn Learning Certificates Configuration
 * These certificates are stored in Google Drive (private)
 * 
 * How to get Google Drive File IDs:
 * 1. Open your Drive folder: https://drive.google.com/drive/folders/1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG
 * 2. Right-click a certificate → "Open in new tab"
 * 3. Copy the FILE_ID from URL: https://drive.google.com/file/d/FILE_ID/view
 * 4. Add entry below with the FILE_ID
 */

export type CertificateConfig = {
  title: string;
  issuer: string;
  category: "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other";
  fileId: string;
  date: string;
};

/**
 * Add your LinkedIn Learning certificate File IDs here
 * Get them from your Google Drive shared folder
 */
export const linkedinCertificates: CertificateConfig[] = [
  // Example format (replace FILE_IDs with your own):
  // {
  //   title: "Design Thinking Approach to Putting the Customer First",
  //   issuer: "LinkedIn Learning",
  //   category: "linkedin",
  //   fileId: "1YOUR_FILE_ID_FROM_GOOGLE_DRIVE_HERE",
  //   date: "2024"
  // },
];

/**
 * Convert Google Drive file ID to preview URL
 */
export const getGoogleDrivePdfUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Get direct download URL for a certificate
 */
export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};
