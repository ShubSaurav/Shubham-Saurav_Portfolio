#!/usr/bin/env node

/**
 * Google Drive Certificates Auto-Extractor
 * Automatically extracts file IDs from organized certificate folders
 * 
 * This script will:
 * 1. Read your certificates folder structure
 * 2. Extract all PDF file IDs
 * 3. Organize by category automatically
 * 4. Generate the config file
 */

import * as https from "https";
import * as fs from "fs";
import * as path from "path";

const MAIN_FOLDER_ID = "1Iz57LjI3nP2pT6gJkSfcTAk5gEelnqZ5";

// Category mapping - update based on your folder names
const categoryMap: Record<string, "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other"> = {
  "linkedin": "linkedin",
  "linkdein": "linkedin", // Handle typo
  "coursera": "coursera",
  "courcera": "coursera", // Handle typo
  "hackathon": "hackathon",
  "workshop": "workshop",
  "meetings": "meetings",
  "meetup": "meetings",
};

const detectCategory = (folderName: string): "linkedin" | "coursera" | "hackathon" | "workshop" | "meetings" | "other" => {
  const lower = folderName.toLowerCase();
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lower.includes(key)) return value;
  }
  return "other";
};

const extractCourseTitle = (fileName: string): string => {
  return fileName
    .replace(/CertificateOfCompletion_/i, "")
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .trim();
};

function fetchFromGoogleDrive(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "drive.google.com",
      port: 443,
      path: new URL(url).pathname + new URL(url).search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
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
    req.setTimeout(10000);
    req.end();
  });
}

async function main() {
  try {
    console.log("🔍 Reading certificates folder structure...\n");

    const mainFolderUrl = `https://drive.google.com/drive/folders/${MAIN_FOLDER_ID}`;
    const html = await fetchFromGoogleDrive(mainFolderUrl);

    // Extract folder names and IDs
    // Look for folder items in the HTML
    const folderPattern = /data-id=["']([a-zA-Z0-9_-]{33})["']\s*data-name=["']([^"']+)["']/g;
    const folders: Array<{ id: string; name: string }> = [];
    let match;

    while ((match = folderPattern.exec(html)) !== null) {
      const id = match[1];
      const name = match[2];
      folders.push({ id, name });
    }

    console.log(`✅ Found ${folders.length} subfolders\n`);

    if (folders.length === 0) {
      console.log("⚠️  Could not extract folders from HTML.");
      console.log("📝 Taking fallback approach...\n");

      // Fallback: Manual folder configuration
      const manualFolders = [
        { id: "1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG", name: "LinkedIn Learning" },
        { id: "1LZHUqu3eZX9oahb83-qymJRZMj1fnhEF", name: "Coursera Courses" },
        { id: "1k4UhQu7Xx_eBa3df3wJT357pdJj5Jfbc", name: "Hackathon" },
        { id: "1z0UlO61SBmTf5oxeFJJpoiodiD5AITXp", name: "Workshop" },
      ];

      console.log("📁 Configured folders:");
      manualFolders.forEach((f) => console.log(`   • ${f.name}`));
      console.log("\n⏳ Extracting PDFs from each folder...\n");

      const allCertificates: Array<{
        title: string;
        issuer: string;
        category: string;
        fileId: string;
        date: string;
      }> = [];

      for (const folder of manualFolders) {
        console.log(`📂 Processing: ${folder.name}`);
        const folderUrl = `https://drive.google.com/drive/folders/${folder.id}`;
        const folderHtml = await fetchFromGoogleDrive(folderUrl);

        // Extract PDF file names and their IDs
        const pdfMatches = Array.from(folderHtml.matchAll(/["']([a-zA-Z0-9_-]{33})["']/g));
        const pdfNames = Array.from(folderHtml.matchAll(/([^?/"<>]+\.pdf)/gi));

        const certificateNames = Array.from(folderHtml.matchAll(/CertificateOfCompletion_[^"<]+\.pdf/gi)).map(m => m[0]);

        console.log(`   ✅ Found ${certificateNames.length} certificates\n`);

        const category = detectCategory(folder.name);

        // Create certificate entries (without IDs for now - would need API)
        certificateNames.forEach((name) => {
          allCertificates.push({
            title: extractCourseTitle(name),
            issuer: folder.name.includes("LinkedIn")
              ? "LinkedIn Learning"
              : folder.name.includes("Coursera")
                ? "Coursera"
                : folder.name,
            category,
            fileId: "NEEDS_MANUAL_EXTRACTION", // TODO: Extract actual IDs
            date: "2024",
          });
        });
      }

      console.log("\n⚠️  Note: File IDs need to be extracted via an alternative method.\n");
      console.log("📋 Found the following certificates:\n");

      allCertificates.forEach((cert) => {
        console.log(`   • ${cert.title} (${cert.issuer})`);
      });

      console.log(`\n📊 Summary:`);
      console.log(`   Total: ${allCertificates.length}`);
      console.log(
        `   LinkedIn: ${allCertificates.filter((c) => c.category === "linkedin").length}`
      );
      console.log(
        `   Coursera: ${allCertificates.filter((c) => c.category === "coursera").length}`
      );
    } else {
      console.log("📁 Folders found:");
      folders.forEach((f) => console.log(`   • ${f.name}`));
    }

    console.log("\n💡 Next Steps:");
    console.log(
      "   1. Install: npm install --save-dev puppeteer (for automated ID extraction)"
    );
    console.log("   2. Or manually add certificate file IDs to src/config/certificates.ts");
    console.log('   3. Format: { title: "...", fileId: "YOUR_FILE_ID", ... }\n');
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("\n💻 Alternative: Use Python script\n");
    console.log("cat > extract_certificates.py << 'EOF'");
    console.log(
      "# Python script to extract Google Drive file IDs (requires google-api-python-client)"
    );
    console.log("EOF\n");
  }
}

main();
