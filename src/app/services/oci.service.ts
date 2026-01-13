import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OCIConfig {
  tenancy: string;
  user: string;
  fingerprint: string;
  privateKey: string;
  region: string;
  compartmentId: string;
}

export interface Bucket {
  name: string;
  subdomain?: string;
  publicAccess: boolean;
}

export interface BucketResponse {
  success: boolean;
  buckets?: any[];
  message?: string;
}

export interface CreateBucketRequest {
  bucketName: string;
  subdomain?: string;
  publicAccess: boolean;
}

export interface BulkCreateRequest {
  buckets: CreateBucketRequest[];
}

export interface BulkDeleteRequest {
  bucketNames: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OciService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  configureCredentials(config: OCIConfig): Observable<any> {
    return this.http.post(`${this.apiUrl}/config`, config);
  }

  listBuckets(): Observable<BucketResponse> {
    return this.http.get<BucketResponse>(`${this.apiUrl}/buckets`);
  }

  createBucket(bucket: CreateBucketRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets`, bucket);
  }

  createBucketsBulk(request: BulkCreateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets/bulk`, request);
  }

  deleteBucket(bucketName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/buckets/${bucketName}`);
  }

  deleteBucketsBulk(request: BulkDeleteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets/bulk-delete`, request);
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
