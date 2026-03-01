# Fast Certificate ID Extraction Guide

Since you have 60+ PDFs, here are the **fastest ways** to extract file IDs:

## Method 1: Browser Bookmarklet (Fastest ⚡)

1. **Create a Bookmarklet:**
   - Right-click your browser bookmark bar → "Add page" 
   - Name: "Extract Drive IDs"
   - URL:
   ```javascript
   javascript:(function(){let ids=[];document.querySelectorAll('[data-id]').forEach(el=>{let id=el.getAttribute('data-id');let name=el.getAttribute('data-name');if(id&&name)ids.push({title:name.replace(/\.pdf$/i,''),id));});console.log(JSON.stringify(ids,null,2));alert('Check console (F12) for IDs!');})();
   ```

2. Open your certificates folder in Google Drive
3. Click the bookmarklet
4. Open DevTools (F12) → Console tab
5. Copy all the IDs and titles

---

## Method 2: One-Click Python Script (Most Reliable)

### Setup (First time only):
```bash
# Install required package
pip install --user google-auth-oauthlib google-auth-httplib2 google-api-python-client

# Or with pipenv/poetry if you use those
```

### Create `extract_drive_ids.py`:
```python
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import json

# Your folder IDs
FOLDERS = {
    "linkedin": "1Hgb1sGunzFO7T8aJ0MT91vIi-AAo2CYG",
    "coursera": "1LZHUqu3eZX9oahb83-qymJRZMj1fnhEF",
    "hackathon": "1k4UhQu7Xx_eBa3df3wJT357pdJj5Jfbc",
    "workshop": "1z0UlO61SBmTf5oxeFJJpoiodiD5AITXp",
}

def extract_from_folder(folder_id, category):
    """Extract all PDF file IDs from a Google Drive folder"""
    drive = build('drive', 'v3')
    
    query = f"'{folder_id}' in parents and mimeType='application/pdf' and trashed=false"
    results = drive.files().list(q=query, spaces='drive', fields='files(id, name)', pageSize=100).execute()
    
    files = results.get('files', [])
    certificates = []
    
    for file in files:
        title = file['name'].replace('CertificateOfCompletion_', '').replace('.pdf', '')
        certificates.append({
            "title": title,
            "fileId": file['id'],
            "category": category
        })
    
    return certificates

# Extract from all folders
all_certs = []
for category, folder_id in FOLDERS.items():
    certs = extract_from_folder(folder_id, category)
    all_certs.extend(certs)
    print(f"✅ {category}: {len(certs)} certificates")

# Generate config file
config = f"""export const linkedinCertificates = {json.dumps(all_certs, indent=2)};"""

with open("certificates_config.ts", "w") as f:
    f.write(config)

print(f"\n✅ Generated config with {len(all_certs)} certificates!")
```

### Run it:
```bash
python3 extract_drive_ids.py
```

---

## Method 3: Browser Console (Manual but Quick)

1. Open Google Drive folder
2. Scroll to load all files (important!)
3. Press F12 → Console tab
4. Paste this:

```javascript
const results = Array.from(
  document.querySelectorAll('[data-id][data-name*=".pdf"]')
).map(el => ({
  id: el.getAttribute('data-id'),
  name: el.getAttribute('data-name')
}));

console.log(JSON.stringify(results, null, 2));
copy(JSON.stringify(results));
```

5. Press Enter - output appears and is copied to clipboard

---

## Method 4: Google Drive API (Official, Reliable)

See `scripts/extractCertificatesAuto.ts` and `BROWSER_EXTRACTOR.js` for setup.

---

## My Recommendation 🎯

**Use Method 2 (Python)** - Most reliable, automatic, handles all folders at once.

**If you don't have Python:** Use Method 3 (Browser Console) - takes ~5 minutes for 60 files.

---

## Once You Have the File IDs:

Copy the generated data into `src/config/certificates.ts` and you're done!

Then go to browser, open your portfolio, and your certificates will display with working filter tabs ✨
