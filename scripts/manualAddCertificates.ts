#!/usr/bin/env node

/**
 * Manual Certificate Adder
 * Interactive script to help you add certificates from Google Drive
 * 
 * Usage: npx ts-node scripts/manualAddCertificates.ts
 */

import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function main() {
  console.log("\n📜 LinkedIn Learning Certificate Adder");
  console.log("=====================================\n");

  const certificates: Array<{
    title: string;
    issuer: string;
    category: string;
    fileId: string;
    date: string;
  }> = [];

  let addMore = true;

  while (addMore) {
    console.log(`\n📝 Certificate #${certificates.length + 1}`);
    console.log("─".repeat(40));

    const title = await question("Certificate Title: ");
    const fileId = await question(
      "Google Drive File ID (from URL drive.google.com/file/d/FILE_ID/view): "
    );
    const category = await question(
      "Category (linkedin/coursera/hackathon/workshop/meetings/other) [linkedin]: "
    );
    const date = await question("Year [2024]: ");

    certificates.push({
      title,
      issuer: "LinkedIn Learning",
      category: category || "linkedin",
      fileId,
      date: date || "2024",
    });

    const continueAdding = await question(
      "\n➕ Add another certificate? (yes/no) [yes]: "
    );
    addMore = continueAdding.toLowerCase() !== "no";
  }

  // Generate config file
  const configContent = `/**
 * LinkedIn Learning Certificates Configuration
 * Manually added from Google Drive
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
    certificates,
    null,
    2
  )};

/**
 * Helper function to convert Google Drive file ID to preview URL
 */
export const getGoogleDrivePdfUrl = (fileId: string): string => {
  return \`https://drive.google.com/file/d/\${fileId}/preview\`;
};

/**
 * Get the direct download URL for a certificate
 */
export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return \`https://drive.google.com/uc?export=download&id=\${fileId}\`;
};
`;

  const configPath = path.join(__dirname, "../src/config/certificates.ts");
  fs.writeFileSync(configPath, configContent);

  console.log("\n✅ Configuration saved to: src/config/certificates.ts");
  console.log(`📊 Total certificates: ${certificates.length}\n`);

  console.log("🚀 Next steps:");
  console.log("   1. Update CertificationsSection.tsx to load from Google Drive");
  console.log("   2. Run: npm run dev");
  console.log("   3. Verify certificates display correctly\n");

  rl.close();
}

main().catch(console.error);
