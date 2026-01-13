# Oracle Cloud Infrastructure Bucket Manager

A comprehensive web application for managing OCI Object Storage buckets with a modern Angular frontend and Node.js backend.

## Features

- 🔐 **Secure OCI Authentication** - Connect using API keys
- 📦 **Bucket Management** - Create and delete buckets easily
- 🌐 **Subdomain Support** - Assign custom subdomains to buckets
- 📊 **Real-time Listing** - View all your buckets with details
- 💾 **Configuration Persistence** - Save your OCI credentials locally
- 🎨 **Modern UI** - Clean, responsive interface

## Prerequisites

- Node.js 14+ and npm
- Oracle Cloud Infrastructure account
- OCI API credentials (Tenancy OCID, User OCID, API Key, etc.)

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure OCI Credentials**

You have two options:

### Option A: Use the Web Interface (Recommended)
1. Start the backend server (see below)
2. Start the Angular app (see below)
3. Navigate to the Configuration tab
4. Enter your OCI credentials in the form

### Option B: Use Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
OCI_TENANCY=ocid1.tenancy.oc1..aaaaaaaa...
OCI_USER=ocid1.user.oc1..aaaaaaaa...
OCI_FINGERPRINT=aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99
OCI_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIE...
OCI_REGION=us-phoenix-1
OCI_COMPARTMENT_ID=ocid1.compartment.oc1..aaaaaaaa...
```

## Getting Your OCI Credentials

1. **Log in to Oracle Cloud Console**
   - Go to https://cloud.oracle.com

2. **Get User OCID**
   - Click your profile icon → User Settings
   - Copy the OCID

3. **Get Tenancy OCID**
   - Click your profile icon → Tenancy: [name]
   - Copy the OCID

4. **Generate API Key**
   - In User Settings, go to "API Keys" under Resources
   - Click "Add API Key"
   - Download the private key (.pem file)
   - Copy the fingerprint shown

5. **Get Compartment OCID**
   - Navigate to Identity → Compartments
   - Find your compartment and copy its OCID

6. **Get Region**
   - Your region is shown in the top-right of the console (e.g., us-phoenix-1)

## Running the Application

### 1. Start the Backend Server

```bash
node server/server.js
```

The backend API will run on `http://localhost:3001`

### 2. Start the Angular Frontend

In a new terminal:

```bash
npm start
```

The Angular app will run on `http://localhost:4200`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```

## Usage

### Initial Setup

1. Navigate to the **Configuration** tab
2. Enter your OCI credentials:
   - Tenancy OCID
   - User OCID
   - API Key Fingerprint
   - Region
   - Compartment OCID
   - Private Key (paste the entire PEM file content)
3. Click "Connect to OCI"
4. Wait for the success message

### Creating Buckets

1. Go to the **Buckets** tab
2. Enter a bucket name (must be unique within your namespace)
3. Optionally, enter a subdomain
4. Click "Create Bucket"
5. The bucket will appear in the list below

### Deleting Buckets

1. Find the bucket in the list
2. Click the "Delete" button
3. Confirm the deletion in the modal
4. The bucket will be removed

### Viewing Bucket Details

Each bucket card shows:
- Bucket name
- Namespace
- Subdomain (if assigned)
- Creation date
- Creator

## API Endpoints

The backend server provides the following REST API endpoints:

- `GET /api/health` - Check server and OCI connection status
- `POST /api/oci/initialize` - Initialize OCI connection with credentials
- `GET /api/buckets` - List all buckets
- `POST /api/buckets` - Create a new bucket
- `DELETE /api/buckets/:bucketName` - Delete a bucket
- `GET /api/buckets/:bucketName` - Get bucket details

## Project Structure

```
/vercel/sandbox/
├── server/
│   ├── server.js           # Express backend server
│   └── oci-service.js      # OCI SDK integration
├── src/
│   └── app/
│       ├── components/
│       │   ├── config/     # Configuration component
│       │   └── bucket-manager/  # Bucket management component
│       └── services/
│           └── oci-api.service.ts  # API service
├── .env.example            # Example environment variables
└── README_OCI.md          # This file
```

## Troubleshooting

### Backend Connection Issues

If you see "Backend server is not running":
1. Make sure the backend server is running on port 3001
2. Check for any error messages in the server terminal
3. Verify your OCI credentials are correct

### OCI Authentication Errors

If you get authentication errors:
1. Verify all OCIDs are correct and complete
2. Ensure the private key is in valid PEM format
3. Check that the API key fingerprint matches
4. Verify the user has permissions in the compartment

### Bucket Creation Fails

Common issues:
- Bucket name already exists (must be globally unique)
- Insufficient permissions in the compartment
- Invalid bucket name (must follow OCI naming rules)

### CORS Errors

If you see CORS errors in the browser console:
1. Ensure the backend server is running
2. Check that the API URL in `oci-api.service.ts` matches your backend URL

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit credentials** - The `.env` file is gitignored
2. **Private keys** - Keep your private keys secure and never share them
3. **Local storage** - Credentials saved in the browser are stored in localStorage
4. **Production use** - For production, implement proper authentication and encryption
5. **API access** - Restrict API key permissions to only what's needed

## Technologies Used

- **Frontend**: Angular 13, TypeScript, RxJS
- **Backend**: Node.js, Express
- **OCI SDK**: oci-sdk (Oracle Cloud Infrastructure SDK)
- **Styling**: Custom CSS with modern design

## License

This project is provided as-is for managing Oracle Cloud Infrastructure buckets.

## Support

For issues related to:
- **OCI SDK**: Check [OCI SDK Documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/nodesdk.htm)
- **Angular**: Check [Angular Documentation](https://angular.io/docs)
- **This Application**: Review the troubleshooting section above
