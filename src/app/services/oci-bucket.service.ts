import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as oci from 'oci-sdk';

export interface BucketInfo {
  name: string;
  subdomain: string;
  createdDate?: Date;
  namespace?: string;
}

export interface BucketCreateRequest {
  bucketName: string;
  subdomain: string;
  publicAccess?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OciBucketService {
  private objectStorageClient: any;
  private namespace: string;
  private compartmentId: string;

  constructor() {
    this.namespace = environment.oci.namespace;
    this.compartmentId = environment.oci.compartmentId;
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      const provider = new oci.common.ConfigFileAuthenticationDetailsProvider();
      
      // Alternative: Use simple authentication provider with environment config
      const simpleProvider = new oci.common.SimpleAuthenticationDetailsProvider(
        environment.oci.tenancyId,
        environment.oci.userId,
        environment.oci.fingerprint,
        environment.oci.privateKey,
        null,
        oci.common.Region.fromRegionId(environment.oci.region)
      );

      this.objectStorageClient = new oci.objectstorage.ObjectStorageClient({
        authenticationDetailsProvider: simpleProvider
      });
    } catch (error) {
      console.error('Error initializing OCI client:', error);
    }
  }

  async createBucket(request: BucketCreateRequest): Promise<any> {
    try {
      const createBucketDetails = {
        name: request.bucketName,
        compartmentId: this.compartmentId,
        publicAccessType: request.publicAccess ? 'ObjectRead' : 'NoPublicAccess',
        metadata: {
          subdomain: request.subdomain
        }
      };

      const createBucketRequest = {
        namespaceName: this.namespace,
        createBucketDetails: createBucketDetails
      };

      const response = await this.objectStorageClient.createBucket(createBucketRequest);
      
      return {
        success: true,
        bucket: response.bucket,
        message: `Bucket ${request.bucketName} created successfully with subdomain ${request.subdomain}`
      };
    } catch (error: any) {
      console.error('Error creating bucket:', error);
      return {
        success: false,
        error: error.message || 'Failed to create bucket'
      };
    }
  }

  async listBuckets(): Promise<BucketInfo[]> {
    try {
      const listBucketsRequest = {
        namespaceName: this.namespace,
        compartmentId: this.compartmentId
      };

      const response = await this.objectStorageClient.listBuckets(listBucketsRequest);
      
      const buckets: BucketInfo[] = response.items.map((bucket: any) => ({
        name: bucket.name,
        subdomain: bucket.metadata?.subdomain || 'N/A',
        createdDate: bucket.timeCreated ? new Date(bucket.timeCreated) : undefined,
        namespace: bucket.namespace
      }));

      return buckets;
    } catch (error: any) {
      console.error('Error listing buckets:', error);
      throw new Error(error.message || 'Failed to list buckets');
    }
  }

  async deleteBucket(bucketName: string): Promise<any> {
    try {
      const deleteBucketRequest = {
        namespaceName: this.namespace,
        bucketName: bucketName
      };

      await this.objectStorageClient.deleteBucket(deleteBucketRequest);
      
      return {
        success: true,
        message: `Bucket ${bucketName} deleted successfully`
      };
    } catch (error: any) {
      console.error('Error deleting bucket:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete bucket'
      };
    }
  }

  async getBucketDetails(bucketName: string): Promise<any> {
    try {
      const getBucketRequest = {
        namespaceName: this.namespace,
        bucketName: bucketName
      };

      const response = await this.objectStorageClient.getBucket(getBucketRequest);
      return response.bucket;
    } catch (error: any) {
      console.error('Error getting bucket details:', error);
      throw new Error(error.message || 'Failed to get bucket details');
    }
  }

  async createMultipleBuckets(requests: BucketCreateRequest[]): Promise<any[]> {
    const results = [];
    
    for (const request of requests) {
      const result = await this.createBucket(request);
      results.push(result);
    }
    
    return results;
  }
}
