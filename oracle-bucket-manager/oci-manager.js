const os = require('oci-objectstorage');
const common = require('oci-common');
const fs = require('fs');
require('dotenv').config();

class OCIBucketManager {
  constructor() {
    this.provider = null;
    this.client = null;
    this.namespace = process.env.OCI_NAMESPACE;
    this.compartmentId = process.env.OCI_COMPARTMENT_OCID;
    this.region = process.env.OCI_REGION;

    this.initializeClient();
  }

  initializeClient() {
    try {
      // Load private key from file
      const privateKeyPath = process.env.OCI_PRIVATE_KEY_PATH.replace('~', process.env.HOME || process.env.USERPROFILE);
      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

      // Create configuration provider
      this.provider = new common.SimpleAuthenticationDetailsProvider(
        process.env.OCI_TENANCY_OCID,
        process.env.OCI_USER_OCID,
        process.env.OCI_FINGERPRINT,
        privateKey,
        null,
        common.Region.fromRegionId(this.region)
      );

      // Create Object Storage client
      this.client = new os.ObjectStorageClient({
        authenticationDetailsProvider: this.provider
      });

      console.log('OCI Client initialized successfully');
    } catch (error) {
      console.error('Error initializing OCI client:', error.message);
      throw error;
    }
  }

  /**
   * Create a bucket with optional subdomain support
   * @param {string} bucketName - Name of the bucket
   * @param {string} subdomain - Optional subdomain prefix
   * @param {object} options - Additional bucket options
   */
  async createBucket(bucketName, subdomain = null, options = {}) {
    try {
      const finalBucketName = subdomain ? `${subdomain}-${bucketName}` : bucketName;

      const createBucketDetails = {
        name: finalBucketName,
        compartmentId: this.compartmentId,
        publicAccessType: options.publicAccess || 'NoPublicAccess',
        storageTier: options.storageTier || 'Standard',
        versioning: options.versioning || 'Disabled',
        autoTiering: options.autoTiering || 'Disabled'
      };

      if (options.metadata) {
        createBucketDetails.metadata = options.metadata;
      }

      const createBucketRequest = {
        namespaceName: this.namespace,
        createBucketDetails: createBucketDetails
      };

      const response = await this.client.createBucket(createBucketRequest);

      return {
        success: true,
        bucket: response.bucket,
        message: `Bucket ${finalBucketName} created successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to create bucket: ${error.message}`
      };
    }
  }

  /**
   * Create multiple buckets with different subdomains
   * @param {string} baseName - Base name for buckets
   * @param {array} subdomains - Array of subdomain prefixes
   * @param {object} options - Additional bucket options
   */
  async createMultipleBuckets(baseName, subdomains, options = {}) {
    const results = [];

    for (const subdomain of subdomains) {
      const result = await this.createBucket(baseName, subdomain, options);
      results.push({
        subdomain,
        bucketName: subdomain ? `${subdomain}-${baseName}` : baseName,
        ...result
      });
    }

    return results;
  }

  /**
   * Delete a bucket
   * @param {string} bucketName - Name of the bucket to delete
   */
  async deleteBucket(bucketName) {
    try {
      const deleteBucketRequest = {
        namespaceName: this.namespace,
        bucketName: bucketName
      };

      await this.client.deleteBucket(deleteBucketRequest);

      return {
        success: true,
        message: `Bucket ${bucketName} deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to delete bucket: ${error.message}`
      };
    }
  }

  /**
   * Delete multiple buckets
   * @param {array} bucketNames - Array of bucket names to delete
   */
  async deleteMultipleBuckets(bucketNames) {
    const results = [];

    for (const bucketName of bucketNames) {
      const result = await this.deleteBucket(bucketName);
      results.push({
        bucketName,
        ...result
      });
    }

    return results;
  }

  /**
   * List all buckets in the compartment
   */
  async listBuckets() {
    try {
      const listBucketsRequest = {
        namespaceName: this.namespace,
        compartmentId: this.compartmentId
      };

      const response = await this.client.listBuckets(listBucketsRequest);

      return {
        success: true,
        buckets: response.items.map(bucket => ({
          name: bucket.name,
          timeCreated: bucket.timeCreated,
          namespace: bucket.namespace,
          publicAccessType: bucket.publicAccessType,
          storageTier: bucket.storageTier
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        buckets: []
      };
    }
  }

  /**
   * Get bucket details
   * @param {string} bucketName - Name of the bucket
   */
  async getBucketDetails(bucketName) {
    try {
      const getBucketRequest = {
        namespaceName: this.namespace,
        bucketName: bucketName
      };

      const response = await this.client.getBucket(getBucketRequest);

      return {
        success: true,
        bucket: response.bucket
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update bucket metadata
   * @param {string} bucketName - Name of the bucket
   * @param {object} updates - Updates to apply
   */
  async updateBucket(bucketName, updates) {
    try {
      const updateBucketDetails = {};

      if (updates.publicAccess !== undefined) {
        updateBucketDetails.publicAccessType = updates.publicAccess;
      }
      if (updates.versioning !== undefined) {
        updateBucketDetails.versioning = updates.versioning;
      }
      if (updates.metadata !== undefined) {
        updateBucketDetails.metadata = updates.metadata;
      }

      const updateBucketRequest = {
        namespaceName: this.namespace,
        bucketName: bucketName,
        updateBucketDetails: updateBucketDetails
      };

      const response = await this.client.updateBucket(updateBucketRequest);

      return {
        success: true,
        bucket: response.bucket,
        message: `Bucket ${bucketName} updated successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to update bucket: ${error.message}`
      };
    }
  }
}

module.exports = OCIBucketManager;
