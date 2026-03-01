/**
 * Simple Certificate File ID Collector
 * 
 * INSTRUCTIONS:
 * 1. For each certificate folder (LinkedIn, Coursera, etc.), do this:
 * 2. Open the folder in Google Drive
 * 3. Right-click any PDF → "Get link" → "Copy link"
 * 4. Paste the link below in the appropriate section
 * 5. Run: npx tsx scripts/collectCertIds.ts
 * 
 * The link format is: https://drive.google.com/file/d/FILE_ID_HERE/view
 * Just paste the full link and the script will extract the ID
 */

// PASTE YOUR CERTIFICATE LINKS HERE
// Get links by: Right-click PDF → "Get link" → Copy

const CERTIFICATES = {
  /**
   * LinkedIn Learning Certificates
   * Open: https://drive.google.com/drive/folders/1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG
   */
  linkedin: [
    // Example: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view",
    // Paste all your LinkedIn certificate links here, one per line
  ],

  /**
   * Coursera Certificates
   * Open: https://drive.google.com/drive/folders/1LZHUqu3eZX9oahb83-qymJRZMj1fnhEF
   */
  coursera: [
    // Paste all your Coursera certificate links here
  ],

  /**
   * Hackathon Certificates
   * Open: https://drive.google.com/drive/folders/1k4UhQu7Xx_eBa3df3wJT357pdJj5Jfbc
   */
  hackathon: [
    // Paste all your Hackathon certificate links here
  ],

  /**
   * Workshop Certificates
   * Open: https://drive.google.com/drive/folders/1z0UlO61SBmTf5oxeFJJpoiodiD5AITXp
   */
  workshop: [
    // Paste all your Workshop certificate links here
  ],
};

// ============ SCRIPT - DON'T MODIFY BELOW THIS LINE ============

import * as fs from "fs";
import * as path from "path";

const extractFileId = (link: string): string | null => {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]{33})\//);
  return match ? match[1] : null;
};

const extractTitle = (fileName: string): string => {
  return fileName
    .replace(/CertificateOfCompletion_/i, "")
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .trim();
};

const issuerMap: Record<string, string> = {
  linkedin: "LinkedIn Learning",
  coursera: "Coursera",
  hackathon: "Hackathon",
  workshop: "Workshop",
  meetings: "Meetups",
};

function main() {
  console.log("📋 Processing certificate links...\n");

  const allCerts: Array<{
    title: string;
    issuer: string;
    category: string;
    fileId: string;
    date: string;
  }> = [];

  for (const [category, links] of Object.entries(CERTIFICATES)) {
    if (!links || links.length === 0) {
      console.log(`⚠️  ${category}: No links provided`);
      continue;
    }

    console.log(`✅ ${category}: ${links.length} certificates`);

    links.forEach((link) => {
      const fileId = extractFileId(link);
      if (fileId) {
        // You'll need to manually add titles, or we'll use generic ones
        allCerts.push({
          title: `Certificate ${allCerts.length + 1}`, // Placeholder - update manually
          issuer: issuerMap[category] || category,
          category: category as any,
          fileId: fileId,
          date: "2024",
        });
      }
    });
  }

  if (allCerts.length === 0) {
    console.log("\n⚠️  No certificates found. Please add links to the CERTIFICATES object above.\n");
    return;
  }

  // Generate config file
  const configContent = `/**
 * LinkedIn Learning Certificates Configuration
 * Generated from Google Drive links
 * Generated: ${new Date().toISOString()}
 */

export type CertificateConfig = {
  title: string;
  issuer: string;
  category: "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other";
  fileId: string;
  date: string;
};

export const linkedinCertificates: CertificateConfig[] = ${JSON.stringify(
    allCerts,
    null,
    2
  )};

export const getGoogleDrivePdfUrl = (fileId: string): string => {
  return \`https://drive.google.com/file/d/\${fileId}/preview\`;
};

export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return \`https://drive.google.com/uc?export=download&id=\${fileId}\`;
};
`;

  const configPath = path.join(__dirname, "../src/config/certificates.ts");
  fs.writeFileSync(configPath, configContent);

  console.log(`\n✅ Generated config with ${allCerts.length} certificates!`);
  console.log(`📁 Saved to: src/config/certificates.ts\n`);

  console.log("📊 Summary:");
  Object.entries(CERTIFICATES).forEach(([cat, links]) => {
    console.log(`   ${cat}: ${links.length}`);
  });

  console.log("\n💡 Next: Update certificate titles in src/config/certificates.ts");
  console.log("   Then run: npm run dev\n");
}

main();
