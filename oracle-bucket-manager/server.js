const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const OCIBucketManager = require('./oci-manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize OCI Manager
let ociManager;
try {
  ociManager = new OCIBucketManager();
} catch (error) {
  console.error('Failed to initialize OCI Manager:', error.message);
  console.error('Please check your .env configuration');
}

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get all buckets
app.get('/api/buckets', async (req, res) => {
  try {
    const result = await ociManager.listBuckets();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get bucket details
app.get('/api/buckets/:bucketName', async (req, res) => {
  try {
    const result = await ociManager.getBucketDetails(req.params.bucketName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Create single bucket
app.post('/api/buckets/create', async (req, res) => {
  try {
    const { bucketName, subdomain, options } = req.body;

    if (!bucketName) {
      return res.status(400).json({ success: false, error: 'Bucket name is required' });
    }

    const result = await ociManager.createBucket(bucketName, subdomain, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Create multiple buckets with subdomains
app.post('/api/buckets/create-multiple', async (req, res) => {
  try {
    const { baseName, subdomains, options } = req.body;

    if (!baseName || !subdomains || !Array.isArray(subdomains)) {
      return res.status(400).json({
        success: false,
        error: 'Base name and subdomains array are required'
      });
    }

    const results = await ociManager.createMultipleBuckets(baseName, subdomains, options);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Delete single bucket
app.delete('/api/buckets/:bucketName', async (req, res) => {
  try {
    const result = await ociManager.deleteBucket(req.params.bucketName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Delete multiple buckets
app.post('/api/buckets/delete-multiple', async (req, res) => {
  try {
    const { bucketNames } = req.body;

    if (!bucketNames || !Array.isArray(bucketNames)) {
      return res.status(400).json({
        success: false,
        error: 'Bucket names array is required'
      });
    }

    const results = await ociManager.deleteMultipleBuckets(bucketNames);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Update bucket
app.put('/api/buckets/:bucketName', async (req, res) => {
  try {
    const { updates } = req.body;
    const result = await ociManager.updateBucket(req.params.bucketName, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Oracle Bucket Manager running on http://localhost:${PORT}`);
  console.log(`Access the web interface at http://localhost:${PORT}`);
});
