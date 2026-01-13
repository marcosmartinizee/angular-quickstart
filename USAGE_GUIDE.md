# Oracle Cloud Bucket Manager - Quick Start Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OCI Credentials

Edit `src/environments/environment.ts` with your Oracle Cloud credentials:

```typescript
export const environment = {
  production: false,
  oci: {
    tenancyId: 'ocid1.tenancy.oc1..aaaaaaaa...',      // Your Tenancy OCID
    userId: 'ocid1.user.oc1..aaaaaaaa...',            // Your User OCID
    fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33...',  // API Key Fingerprint
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
...your private key...
-----END RSA PRIVATE KEY-----`,                       // Your Private Key
    region: 'us-ashburn-1',                            // Your Region
    compartmentId: 'ocid1.compartment.oc1..aaa...',   // Compartment OCID
    namespace: 'your-namespace'                        // Object Storage Namespace
  }
};
```

### 3. Run the Application
```bash
npm start
```

Open your browser to `http://localhost:4200`

## 📋 Features

### Create Buckets
- Enter bucket name and subdomain
- Toggle public access
- Add multiple buckets at once
- Click "Create Bucket(s)"

### View Buckets
- See all existing buckets in a table
- View bucket names, subdomains, and creation dates
- Refresh the list anytime

### Delete Buckets
- Click "Delete" button next to any bucket
- Confirm deletion in the popup

## 🔑 Getting OCI Credentials

### Generate API Keys
```bash
mkdir ~/.oci
openssl genrsa -out ~/.oci/oci_api_key.pem 2048
openssl rsa -pubout -in ~/.oci/oci_api_key.pem -out ~/.oci/oci_api_key_public.pem
```

### Add Public Key to OCI
1. Login to Oracle Cloud Console
2. Profile → User Settings → API Keys
3. Click "Add API Key"
4. Upload `oci_api_key_public.pem`

### Get OCIDs
- **Tenancy OCID**: Profile → Tenancy
- **User OCID**: Profile → User Settings
- **Compartment OCID**: Identity → Compartments
- **Namespace**: Object Storage → Buckets (shown at top)
- **Region**: Top-right corner of console

## 📝 Naming Rules

**Bucket Names:**
- 1-255 characters
- Alphanumeric, hyphens, underscores
- Must start with letter or number

**Subdomains:**
- 2-63 characters
- Alphanumeric and hyphens
- Must start and end with letter or number

## 🛠️ Troubleshooting

### Authentication Errors
- Verify all OCIDs are correct
- Check API key fingerprint matches
- Ensure private key is in PEM format

### Permission Errors
Add IAM policy:
```
Allow group YourGroup to manage buckets in compartment YourCompartment
Allow group YourGroup to manage objects in compartment YourCompartment
```

### Build Issues
If build fails due to memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 📦 Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── bucket-manager/          # Main UI component
│   │       ├── bucket-manager.component.ts
│   │       ├── bucket-manager.component.html
│   │       └── bucket-manager.component.css
│   ├── services/
│   │   └── oci-bucket.service.ts    # OCI API integration
│   └── environments/
│       ├── environment.ts            # Development config
│       └── environment.prod.ts       # Production config
```

## 🔒 Security Best Practices

1. ✅ Never commit credentials to git
2. ✅ Use environment variables in production
3. ✅ Rotate API keys regularly
4. ✅ Use minimum required permissions
5. ✅ Enable MFA on OCI account

## 📚 Additional Resources

- [OCI SDK Documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)
- [Object Storage API](https://docs.oracle.com/en-us/iaas/api/#/en/objectstorage/20160918/)
- [Angular Documentation](https://angular.io/docs)

## 🎯 Example Usage

### Create Single Bucket
1. Bucket Name: `my-app-storage`
2. Subdomain: `app-data`
3. Public Access: ☐ (unchecked)
4. Click "Create Bucket(s)"

### Create Multiple Buckets
1. First bucket: `images-bucket` / `images`
2. Click "+ Add Another Bucket"
3. Second bucket: `videos-bucket` / `videos`
4. Click "+ Add Another Bucket"
5. Third bucket: `documents-bucket` / `docs`
6. Click "Create Bucket(s)"

All three buckets will be created simultaneously!

## 💡 Tips

- Use descriptive bucket names
- Keep subdomains short and memorable
- Enable public access only when necessary
- Regularly review and clean up unused buckets
- Use the refresh button to see latest changes

---

For detailed setup instructions, see `README_OCI_SETUP.md`
