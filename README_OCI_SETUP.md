# Oracle Cloud Bucket Manager - Setup Guide

## Overview
This application provides a graphical interface to manage Oracle Cloud Infrastructure (OCI) Object Storage buckets with custom subdomains.

## Features
- ✅ Create multiple buckets with different subdomains
- ✅ List all existing buckets
- ✅ Delete buckets
- ✅ Configure public/private access
- ✅ Beautiful, responsive UI
- ✅ Form validation

## Prerequisites

1. **Oracle Cloud Account**: You need an active OCI account
2. **API Keys**: Generate API signing keys for authentication
3. **Required Information**:
   - Tenancy OCID
   - User OCID
   - API Key Fingerprint
   - Private Key (PEM format)
   - Region (e.g., us-ashburn-1)
   - Compartment OCID
   - Object Storage Namespace

## Setup Instructions

### 1. Generate OCI API Keys

```bash
# Create .oci directory
mkdir ~/.oci

# Generate private key
openssl genrsa -out ~/.oci/oci_api_key.pem 2048

# Generate public key
openssl rsa -pubout -in ~/.oci/oci_api_key.pem -out ~/.oci/oci_api_key_public.pem

# Get fingerprint
openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
```

### 2. Add Public Key to OCI Console

1. Log in to Oracle Cloud Console
2. Go to **Profile** → **User Settings**
3. Click **API Keys** → **Add API Key**
4. Upload the public key (`oci_api_key_public.pem`)
5. Note the fingerprint displayed

### 3. Get Required OCIDs

**Tenancy OCID:**
- Profile → Tenancy → Copy OCID

**User OCID:**
- Profile → User Settings → Copy OCID

**Compartment OCID:**
- Identity → Compartments → Select compartment → Copy OCID

**Namespace:**
- Object Storage → Buckets → Note the namespace at the top

**Region:**
- Check your current region in the top-right corner (e.g., us-ashburn-1)

### 4. Configure the Application

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  oci: {
    tenancyId: 'ocid1.tenancy.oc1..aaaaaaaa...',
    userId: 'ocid1.user.oc1..aaaaaaaa...',
    fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99',
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...your private key content...
-----END RSA PRIVATE KEY-----`,
    region: 'us-ashburn-1',
    compartmentId: 'ocid1.compartment.oc1..aaaaaaaa...',
    namespace: 'your-namespace'
  }
};
```

**Alternative: Use File Path for Private Key**

```typescript
privateKey: '/home/user/.oci/oci_api_key.pem'
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
npm start
```

Navigate to `http://localhost:4200`

## Usage

### Creating Buckets

1. Enter a **Bucket Name** (alphanumeric, hyphens, underscores)
2. Enter a **Subdomain** (alphanumeric and hyphens)
3. Optionally enable **Public Access**
4. Click **"+ Add Another Bucket"** to create multiple buckets at once
5. Click **"Create Bucket(s)"**

### Viewing Buckets

- All existing buckets are displayed in the table below
- Click **"Refresh"** to reload the list

### Deleting Buckets

- Click the **"Delete"** button next to any bucket
- Confirm the deletion

## Bucket Naming Rules

**Bucket Name:**
- Must be unique within the namespace
- 1-255 characters
- Start with alphanumeric character
- Can contain letters, numbers, hyphens, underscores

**Subdomain:**
- 2-63 characters
- Start and end with alphanumeric character
- Can contain letters, numbers, hyphens

## Production Deployment

For production, use environment variables:

```bash
export OCI_TENANCY_ID="ocid1.tenancy..."
export OCI_USER_ID="ocid1.user..."
export OCI_FINGERPRINT="aa:bb:cc..."
export OCI_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
export OCI_REGION="us-ashburn-1"
export OCI_COMPARTMENT_ID="ocid1.compartment..."
export OCI_NAMESPACE="your-namespace"
```

Build for production:

```bash
npm run build
```

## Troubleshooting

### Authentication Errors

- Verify all OCIDs are correct
- Check that the API key fingerprint matches
- Ensure the private key is in correct PEM format
- Verify the user has permissions for Object Storage

### Permission Errors

Required IAM policies:

```
Allow group YourGroup to manage buckets in compartment YourCompartment
Allow group YourGroup to manage objects in compartment YourCompartment
```

### Network Errors

- Check your internet connection
- Verify the region is correct
- Ensure OCI services are accessible

## API Reference

The application uses the OCI SDK for TypeScript:
- [OCI SDK Documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)
- [Object Storage API](https://docs.oracle.com/en-us/iaas/api/#/en/objectstorage/20160918/)

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit credentials** to version control
2. Use environment variables in production
3. Restrict API key permissions to minimum required
4. Rotate API keys regularly
5. Use compartments to isolate resources
6. Enable MFA on your OCI account

## Support

For issues with:
- **OCI SDK**: Check [OCI SDK GitHub](https://github.com/oracle/oci-typescript-sdk)
- **Angular**: Check [Angular Documentation](https://angular.io/docs)
- **This Application**: Check the code comments and console logs

## License

This application is provided as-is for managing Oracle Cloud buckets.
