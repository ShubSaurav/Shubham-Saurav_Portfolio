/**
 * Google Drive Certificate Extractor - Browser Console Version
 * 
 * INSTRUCTIONS:
 * 1. Open your certificates folder in Google Drive
 * 2. Open Browser DevTools (F12 or Cmd+Option+J)
 * 3. Paste this entire script into the Console tab
 * 4. Press Enter
 * 5. The script will extract all folder structure and file IDs
 * 6. Copy the JSON output and save it
 */

async function extractCertificates() {
  console.log("🚀 Starting Google Drive Certificate Extractor...\n");

  // Configuration - Update these based on your actual folder IDs
  const FOLDERS = {
    linkedin: "1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG", // LinkedIn Learning
    coursera: "1LZHUqu3eZX9oahb83-qymJRZMj1fnhEF", // Coursera
    hackathon: "1k4UhQu7Xx_eBa3df3wJT357pdJj5Jfbc", // Hackathon
    workshop: "1z0UlO61SBmTf5oxeFJJpoiodiD5AITXp", // Workshop
    // Uncomment if you have meetings folder:
    // meetings: "YOUR_MEETINGS_FOLDER_ID",
  };

  const extractTitleFromFileName = (fileName) => {
    return fileName
      .replace(/CertificateOfCompletion_/i, "")
      .replace(/\.pdf$/i, "")
      .replace(/[-_]/g, " ")
      .trim();
  };

  // Navigate to each folder and collect PDFs
  const results = {};

  for (const [category, folderId] of Object.entries(FOLDERS)) {
    console.log(`📂 Processing ${category.toUpperCase()} folder...`);
    results[category] = [];

    // Navigate to folder
    window.location.hash = `#folders/${folderId}`;
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for folder to load

    // Get all PDF elements
    const pdfElements = document.querySelectorAll('[data-id][data-name*=".pdf"]');

    console.log(`   Found ${pdfElements.length} PDFs\n`);

    pdfElements.forEach((element) => {
      const fileId = element.getAttribute("data-id");
      const fileName = element.getAttribute("data-name");

      if (fileName && fileId) {
        results[category].push({
          title: extractTitleFromFileName(fileName),
          fileId: fileId,
          fileName: fileName,
        });
      }
    });
  }

  // Generate TypeScript config file content
  const configContent = `/**
 * LinkedIn Learning Certificates Configuration
 * Auto-generated from Google Drive
 * Generated: ${new Date().toISOString()}
 */

export type CertificateConfig = {
  title: string;
  issuer: string;
  category: "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other";
  fileId: string;
  date: string;
};

export const linkedinCertificates: CertificateConfig[] = [
${Object.entries(results)
  .flatMap(([category, certs]) => {
    const issuerMap = {
      linkedin: "LinkedIn Learning",
      coursera: "Coursera",
      hackathon: "Hackathon",
      workshop: "Workshop",
      meetings: "Meetups",
    };

    return (certs as any[]).map(
      (cert) => `
  {
    title: "${cert.title.replace(/"/g, '\\"')}",
    issuer: "${issuerMap[category]}",
    category: "${category}",
    fileId: "${cert.fileId}",
    date: "2024"
  },`
    );
  })
  .join("\n")}
];

export const getGoogleDrivePdfUrl = (fileId: string): string => {
  return \`https://drive.google.com/file/d/\${fileId}/preview\`;
};

export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return \`https://drive.google.com/uc?export=download&id=\${fileId}\`;
};
`;

  // Output results
  console.log("\n✅ EXTRACTION COMPLETE!\n");
  console.log("📊 Summary:");
  Object.entries(results).forEach(([category, certs]) => {
    console.log(`   ${category}: ${(certs as any[]).length} certificates`);
  });

  console.log("\n📋 Generated Config File Content:\n");
  console.log("─".repeat(80));
  console.log(configContent);
  console.log("─".repeat(80));

  console.log("\n📝 Next Steps:");
  console.log("1. Copy the config content above");
  console.log("2. Replace contents of: src/config/certificates.ts");
  console.log("3. Run: npm run dev");
  console.log("4. Your certificates will display with filters!\n");

  // Save to clipboard if possible
  try {
    await navigator.clipboard.writeText(configContent);
    console.log("✅ Config copied to clipboard!");
  } catch (err) {
    console.log("Note: Could not auto-copy to clipboard. Please manually copy above.\n");
  }

  return {
    certificates: results,
    configFile: configContent,
  };
}

// Run the extraction
extractCertificates().then((result) => {
  console.log("\n🎉 Done! Use the config above to update src/config/certificates.ts");
});
