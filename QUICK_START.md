# Quick Start Guide - OCI Bucket Manager

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
node server/server.js
```

You should see:
```
OCI Bucket Management Server running on port 3001
API available at http://localhost:3001/api
```

### Step 2: Start the Angular Frontend

Open a **new terminal** (keep the backend running) and run:

```bash
npm start
```

Wait for the compilation to complete. You should see:
```
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 3: Configure Your OCI Credentials

1. Open your browser and go to: **http://localhost:4200**

2. Click on the **Configuration** tab in the navigation

3. Fill in your Oracle Cloud credentials:
   - **Tenancy OCID**: Your OCI tenancy identifier
   - **User OCID**: Your OCI user identifier
   - **API Key Fingerprint**: From your API key
   - **Region**: Select your OCI region (e.g., us-phoenix-1)
   - **Compartment OCID**: The compartment where buckets will be created
   - **Private Key**: Paste your entire PEM private key content

4. Click **"Connect to OCI"**

5. Once connected, go to the **Buckets** tab

## 📦 Using the Application

### Create a Bucket

1. In the "Create New Bucket" section:
   - Enter a **Bucket Name** (must be unique)
   - Optionally enter a **Subdomain**
   - Click **"+ Create Bucket"**

2. Your new bucket will appear in the list below

### Delete a Bucket

1. Find the bucket in the list
2. Click the **"🗑 Delete"** button
3. Confirm the deletion
4. The bucket will be removed

### Refresh the List

Click the **"↻ Refresh"** button to reload all buckets from OCI

## 🔑 Where to Find Your OCI Credentials

### 1. Tenancy OCID
- Oracle Cloud Console → Click your profile → Tenancy: [name]
- Copy the OCID shown

### 2. User OCID
- Oracle Cloud Console → Click your profile → User Settings
- Copy the OCID shown

### 3. API Key & Fingerprint
- User Settings → Resources → API Keys
- Click "Add API Key"
- Download the private key (.pem file)
- Copy the fingerprint displayed

### 4. Region
- Shown in the top-right corner of Oracle Cloud Console
- Examples: us-phoenix-1, us-ashburn-1, eu-frankfurt-1

### 5. Compartment OCID
- Oracle Cloud Console → Identity → Compartments
- Find your compartment and copy its OCID

## 🛠️ Troubleshooting

### "Backend server is not running"
- Make sure you started the backend: `node server/server.js`
- Check that it's running on port 3001

### "Failed to connect to OCI"
- Verify all your credentials are correct
- Make sure your private key includes the BEGIN and END lines
- Check that your user has permissions in the compartment

### "Failed to create bucket"
- Bucket names must be unique across all of OCI
- Check that you have permissions to create buckets
- Ensure the bucket name follows OCI naming rules (lowercase, no spaces)

## 📝 Example Credentials Format

```
Tenancy OCID: ocid1.tenancy.oc1..aaaaaaaabcdefghijklmnopqrstuvwxyz123456789
User OCID: ocid1.user.oc1..aaaaaaaabcdefghijklmnopqrstuvwxyz123456789
Fingerprint: aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99
Region: us-phoenix-1
Compartment OCID: ocid1.compartment.oc1..aaaaaaaabcdefghijklmnopqrstuvwxyz123456789

Private Key:
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(multiple lines)
...
-----END RSA PRIVATE KEY-----
```

## 🎯 Features

✅ Create buckets with custom names  
✅ Assign subdomains to buckets  
✅ List all existing buckets  
✅ View bucket details (namespace, creation date, creator)  
✅ Delete buckets with confirmation  
✅ Save configuration locally  
✅ Modern, responsive UI  

## 🔒 Security Note

Your credentials are stored in your browser's localStorage. For production use, implement proper backend authentication and encryption.

---

**Need more help?** Check the full documentation in `README_OCI.md`
