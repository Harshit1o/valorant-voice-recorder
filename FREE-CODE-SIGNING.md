# Free Code Signing Alternatives

## 1. Open Source Certificate Authority
- **SignPath.io** - Free for open source projects
- **Let's Encrypt** - Free certificates (but not for code signing)

## 2. Microsoft Store Distribution
- **Cost:** $19 one-time registration
- **Benefit:** No security warnings
- **Process:** Package as MSIX and distribute via Microsoft Store

## 3. Chocolatey Package Manager
- **Cost:** Free
- **Benefit:** Users trust Chocolatey packages
- **Process:** Submit your app to Chocolatey repository

## 4. Winget Package Manager
- **Cost:** Free
- **Benefit:** Official Microsoft package manager
- **Process:** Submit to winget-pkgs repository

## 5. Community Trust Building
- **Cost:** Free
- **Method:** 
  - Get positive reviews on GitHub
  - Submit to software review sites
  - Build reputation over time
  - Windows learns to trust your app

## Implementation Steps for Self-Signed Certificate:

1. **Run the PowerShell script** (as Administrator):
   ```powershell
   .\create-self-signed-cert.ps1
   ```

2. **Update package.json** with certificate path:
   ```json
   "win": {
     "certificateFile": "certs/certificate.pfx",
     "certificatePassword": "YourPasswordHere123!"
   }
   ```

3. **Build with signing:**
   ```bash
   npm run dist:win
   ```

## Note:
Even with self-signed certificates, users will still see warnings but can choose to trust your certificate permanently.