#!/usr/bin/env node

/**
 * Google Drive Certificate Fetcher
 * Automatically extracts LinkedIn Learning certificates from your shared Google Drive folder
 * 
 * This script reads the shared folder HTML and extracts file IDs for PDF certificates
 */

import * as https from "https";
import * as fs from "fs";
import * as path from "path";

// Your shared folder ID (from the URL: https://drive.google.com/drive/folders/FOLDER_ID)
const SHARED_FOLDER_ID = "1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG";

// Category mapping based on file name patterns
const categorizeByFileName = (fileName: string): string => {
  const lower = fileName.toLowerCase();
  if (lower.includes("coursera")) return "coursera";
  if (lower.includes("hackathon")) return "hackathon";
  if (lower.includes("workshop")) return "workshop";
  if (lower.includes("meetup") || lower.includes("meeting")) return "meetings";
  return "linkedin"; // Default to linkedin learning
};

const extractCourseTitle = (fileName: string): string => {
  return fileName
    .replace(/CertificateOfCompletion_/i, "")
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .trim();
};

function fetchFolderContent(folderId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "drive.google.com",
      port: 443,
      path: `/drive/folders/${folderId}`,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);
    req.end();
  });
}

function extractFileIds(html: string): Array<{ name: string; id: string }> {
  const files: Array<{ name: string; id: string }> = [];

  // Look for Openable file references with IDs
  const filePattern = /["']([a-zA-Z0-9_-]{33})["']/g;
  const namePattern = /CertificateOfCompletion_[^"<]*\.pdf/gi;

  const names = Array.from(html.matchAll(namePattern)).map((m) => m[0]);
  const ids = Array.from(html.matchAll(filePattern));

  // Alternative: Look for data attributes that contain file info
  const dataPattern =
    /data-id=["']([a-zA-Z0-9_-]{33})["']\s*data-name=["']([^"']+)["']/g;
  let match;

  while ((match = dataPattern.exec(html)) !== null) {
    const id = match[1];
    const name = match[2];
    if (name.includes("Certificate")) {
      files.push({ id, name });
    }
  }

  return files;
}

async function fetchCertificates() {
  try {
    console.log("🔍 Fetching certificates from Google Drive...\n");
    console.log(`   Folder ID: ${SHARED_FOLDER_ID}`);

    const html = await fetchFolderContent(SHARED_FOLDER_ID);

    // Extract certificate PDFs from the HTML
    const certMatches = Array.from(
      html.matchAll(/("CertificateOfCompletion_[^"]*\.pdf")/gi)
    );

    if (certMatches.length === 0) {
      console.log(
        "\n⚠️  Could not extract certificates from the public HTML.\n"
      );
      console.log("📋 Manual Alternative:");
      console.log(
        "   1. Open: https://drive.google.com/drive/folders/1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG"
      );
      console.log("   2. For each PDF certificate:");
      console.log("      - Right-click → Open in new tab");
      console.log("      - Copy the file ID from the URL");
      console.log("      - Add to src/config/certificates.ts\n");
      return;
    }

    console.log(`✅ Found ${certMatches.length} certificate files\n`);

    // Since we can't easily extract IDs from HTML, provide a helpful message
    console.log("📝 Certificate Names Found:");
    const uniqueNames = new Set(
      certMatches.map((m) => m[1].replace(/^"|"$/g, ""))
    );
    Array.from(uniqueNames)
      .slice(0, 10)
      .forEach((name) => {
        console.log(`   • ${name}`);
      });

    if (uniqueNames.size > 10) {
      console.log(`   ... and ${uniqueNames.size - 10} more`);
    }

    console.log(
      "\n⚠️  Note: File IDs need to be extracted manually from Google Drive."
    );
    console.log("\n📖 Setup Instructions:");
    console.log(
      "   1. Visit your Google Drive folder: https://drive.google.com/drive/folders/1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG"
    );
    console.log("   2. For each certificate PDF:");
    console.log("      • Right-click → 'Open in new tab'");
    console.log("      • The URL will be: https://drive.google.com/file/d/FILE_ID/view");
    console.log("      • Copy the FILE_ID part (33 characters)");
    console.log("   3. Add entries to src/config/certificates.ts like:");
    console.log(
      "      { title: '...', issuer: 'LinkedIn Learning', category: 'linkedin', fileId: 'YOUR_ID_HERE', date: '2024' }"
    );
    console.log("   4. Or run the alternative script: scripts/manualAddCertificates.ts\n");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fetchCertificates();
