# PowerShell script to create self-signed certificate for code signing
# Run this as Administrator in PowerShell

# Create self-signed certificate
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=Valorant Voice Recorder" -KeyAlgorithm RSA -KeyLength 2048 -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" -KeyExportPolicy Exportable -KeyUsage DigitalSignature -CertStoreLocation Cert:\CurrentUser\My

# Export certificate to PFX file
$pwd = ConvertTo-SecureString -String "YourPasswordHere123!" -Force -AsPlainText
$path = "C:\Users\hp\OneDrive\Documents\startup\certs\certificate.pfx"

# Create certs directory if it doesn't exist
if (!(Test-Path "C:\Users\hp\OneDrive\Documents\startup\certs")) {
    New-Item -ItemType Directory -Path "C:\Users\hp\OneDrive\Documents\startup\certs"
}

# Export the certificate
Export-PfxCertificate -cert $cert -FilePath $path -Password $pwd

Write-Host "Certificate created at: $path"
Write-Host "Password: YourPasswordHere123!"
Write-Host "Thumbprint: $($cert.Thumbprint)"