const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ociService = require('./oci-service');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    initialized: ociService.isInitialized() 
  });
});

// Initialize OCI connection
app.post('/api/oci/initialize', async (req, res) => {
  try {
    const { tenancy, user, fingerprint, privateKey, region, compartmentId } = req.body;

    if (!tenancy || !user || !fingerprint || !privateKey || !region || !compartmentId) {
      return res.status(400).json({ 
        error: 'Missing required configuration parameters' 
      });
    }

    const config = {
      tenancy,
      user,
      fingerprint,
      privateKey,
      region,
      compartmentId
    };

    const result = await ociService.initialize(config);
    res.json(result);
  } catch (error) {
    console.error('Initialize Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to initialize OCI connection' 
    });
  }
});

// List all buckets
app.get('/api/buckets', async (req, res) => {
  try {
    const buckets = await ociService.listBuckets();
    res.json({ buckets });
  } catch (error) {
    console.error('List Buckets Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to list buckets' 
    });
  }
});

// Create a new bucket
app.post('/api/buckets', async (req, res) => {
  try {
    const { bucketName, subdomain } = req.body;

    if (!bucketName) {
      return res.status(400).json({ 
        error: 'Bucket name is required' 
      });
    }

    const result = await ociService.createBucket(bucketName, subdomain);
    res.json(result);
  } catch (error) {
    console.error('Create Bucket Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create bucket' 
    });
  }
});

// Delete a bucket
app.delete('/api/buckets/:bucketName', async (req, res) => {
  try {
    const { bucketName } = req.params;

    if (!bucketName) {
      return res.status(400).json({ 
        error: 'Bucket name is required' 
      });
    }

    const result = await ociService.deleteBucket(bucketName);
    res.json(result);
  } catch (error) {
    console.error('Delete Bucket Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete bucket' 
    });
  }
});

// Get bucket details
app.get('/api/buckets/:bucketName', async (req, res) => {
  try {
    const { bucketName } = req.params;

    if (!bucketName) {
      return res.status(400).json({ 
        error: 'Bucket name is required' 
      });
    }

    const bucket = await ociService.getBucketDetails(bucketName);
    res.json({ bucket });
  } catch (error) {
    console.error('Get Bucket Details Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get bucket details' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`OCI Bucket Management Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
