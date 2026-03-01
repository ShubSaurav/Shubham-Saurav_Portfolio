# Adding LinkedIn Learning Certificates from Google Drive

## Quick Start

Instead of storing certificates in git (which makes them public), fetch them from your private Google Drive folder.

### Step 1: Get Certificate File IDs

For each certificate you want to add:

1. Open your Google Drive folder: https://drive.google.com/drive/folders/1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG
2. Right-click on a certificate PDF → **Open in new tab**
3. Copy the URL, it will look like:
   ```
   https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view
   ```
4. Extract the ID: `1a2b3c4d5e6f7g8h9i0j` (the part between `/d/` and `/view`)

### Step 2: Add Certificates to Configuration

**Option A: Interactive Script (Easiest)**

```bash
npx ts-node scripts/manualAddCertificates.ts
```

This will prompt you for each certificate and generate the config file.

**Option B: Manual Edit**

Edit `src/config/certificates.ts` and add your certificates:

```typescript
export const linkedinCertificates: CertificateConfig[] = [
  {
    title: "Design Thinking Approach to Putting the Customer First",
    issuer: "LinkedIn Learning",
    category: "linkedin",
    fileId: "1a2b3c4d5e6f7g8h9i0j", // Replace with your ID
    date: "2024"
  },
  {
    title: "Agile Foundations",
    issuer: "LinkedIn Learning",
    category: "linkedin",
    fileId: "2x3y4z5a6b7c8d9e0f1g", // Replace with your ID
    date: "2024"
  }
];
```

### Step 3: Update CertificationsSection Component

The component will automatically load certificates from Google Drive using the `linkedinCertificates` array.

## File Structure

```
src/
├── config/
│   └── certificates.ts      # Your certificate configuration
├── components/
│   └── CertificationsSection.tsx  # Displays certificates from Google Drive
└── lib/
    └── googleDriveHelper.ts  # Utility functions
```

## How It Works

- **Private**: Certificates remain private in your Google Drive
- **Dynamic**: No need to rebuild the app when adding certificates
- **Shared Link**: Google Drive PDFs display inline using preview links
- **No Git Storage**: Certificates are NOT committed to GitHub

## Viewing Certificates

Certificates are displayed as:
- **PDF Preview**: Embedded Google Drive preview viewer
- **Download Link**: Direct link to download the certificate
- **Thumbnail**: Auto-generated thumbnail from first PDF page

## FAQ

**Q: Do I need to share my entire Google Drive?**  
A: No, only share the specific folder containing certificates.

**Q: Will my certificates be public?**  
A: No, only people with the sharing link can view them (keep the sharing level set to "Anyone with the link").

**Q: Can I add certificates later?**  
A: Yes! Just add more entries to `linkedinCertificates` array and the website will update automatically.

**Q: What formats are supported?**  
A: PDF (recommended), JPG, PNG, and other image formats supported by Google Drive preview.
