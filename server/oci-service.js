const os = require('oci-objectstorage');
const common = require('oci-common');

class OCIService {
  constructor() {
    this.provider = null;
    this.client = null;
    this.namespace = null;
    this.compartmentId = null;
  }

  async initialize(config) {
    try {
      // Create authentication provider from API key config
      this.provider = new common.SimpleAuthenticationDetailsProvider(
        config.tenancy,
        config.user,
        config.fingerprint,
        config.privateKey,
        null,
        config.region
      );

      // Create Object Storage client
      this.client = new os.ObjectStorageClient({
        authenticationDetailsProvider: this.provider
      });

      this.compartmentId = config.compartmentId;
      
      // Get namespace
      const namespaceRequest = {};
      const namespaceResponse = await this.client.getNamespace(namespaceRequest);
      this.namespace = namespaceResponse.value;

      return { success: true, namespace: this.namespace };
    } catch (error) {
      console.error('OCI Initialization Error:', error);
      throw new Error(`Failed to initialize OCI: ${error.message}`);
    }
  }

  async listBuckets() {
    if (!this.client || !this.namespace) {
      throw new Error('OCI client not initialized. Please configure credentials first.');
    }

    try {
      const request = {
        namespaceName: this.namespace,
        compartmentId: this.compartmentId
      };

      const response = await this.client.listBuckets(request);
      return response.items || [];
    } catch (error) {
      console.error('List Buckets Error:', error);
      throw new Error(`Failed to list buckets: ${error.message}`);
    }
  }

  async createBucket(bucketName, subdomain = null) {
    if (!this.client || !this.namespace) {
      throw new Error('OCI client not initialized. Please configure credentials first.');
    }

    try {
      const bucketDetails = {
        name: bucketName,
        compartmentId: this.compartmentId,
        publicAccessType: 'NoPublicAccess',
        storageTier: 'Standard',
        versioning: 'Disabled'
      };

      // Add metadata for subdomain if provided
      if (subdomain) {
        bucketDetails.metadata = {
          subdomain: subdomain
        };
      }

      const request = {
        namespaceName: this.namespace,
        createBucketDetails: bucketDetails
      };

      const response = await this.client.createBucket(request);
      return {
        success: true,
        bucket: response.bucket,
        message: `Bucket '${bucketName}' created successfully`
      };
    } catch (error) {
      console.error('Create Bucket Error:', error);
      throw new Error(`Failed to create bucket: ${error.message}`);
    }
  }

  async deleteBucket(bucketName) {
    if (!this.client || !this.namespace) {
      throw new Error('OCI client not initialized. Please configure credentials first.');
    }

    try {
      const request = {
        namespaceName: this.namespace,
        bucketName: bucketName
      };

      await this.client.deleteBucket(request);
      return {
        success: true,
        message: `Bucket '${bucketName}' deleted successfully`
      };
    } catch (error) {
      console.error('Delete Bucket Error:', error);
      throw new Error(`Failed to delete bucket: ${error.message}`);
    }
  }

  async getBucketDetails(bucketName) {
    if (!this.client || !this.namespace) {
      throw new Error('OCI client not initialized. Please configure credentials first.');
    }

    try {
      const request = {
        namespaceName: this.namespace,
        bucketName: bucketName
      };

      const response = await this.client.getBucket(request);
      return response.bucket;
    } catch (error) {
      console.error('Get Bucket Details Error:', error);
      throw new Error(`Failed to get bucket details: ${error.message}`);
    }
  }

  isInitialized() {
    return this.client !== null && this.namespace !== null;
  }
}

module.exports = new OCIService();
