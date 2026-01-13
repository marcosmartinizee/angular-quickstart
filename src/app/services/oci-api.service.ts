import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  namespace?: string;
  compartmentId?: string;
  createdBy?: string;
  timeCreated?: string;
  etag?: string;
  metadata?: { [key: string]: string };
}

export interface BucketResponse {
  buckets: Bucket[];
}

export interface CreateBucketRequest {
  bucketName: string;
  subdomain?: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  bucket?: Bucket;
  namespace?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OciApiService {
  private apiUrl = 'http://localhost:3001/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  initializeOCI(config: OCIConfig): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/oci/initialize`,
      config,
      this.httpOptions
    );
  }

  listBuckets(): Observable<BucketResponse> {
    return this.http.get<BucketResponse>(`${this.apiUrl}/buckets`);
  }

  createBucket(request: CreateBucketRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/buckets`,
      request,
      this.httpOptions
    );
  }

  deleteBucket(bucketName: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/buckets/${bucketName}`
    );
  }

  getBucketDetails(bucketName: string): Observable<{ bucket: Bucket }> {
    return this.http.get<{ bucket: Bucket }>(
      `${this.apiUrl}/buckets/${bucketName}`
    );
  }

  checkHealth(): Observable<{ status: string; initialized: boolean }> {
    return this.http.get<{ status: string; initialized: boolean }>(
      `${this.apiUrl}/health`
    );
  }
}
