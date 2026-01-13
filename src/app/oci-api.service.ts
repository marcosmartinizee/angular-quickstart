import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ListBucketsResponse {
  namespace: string;
  buckets: Array<{
    name: string;
    createdBy?: string;
    timeCreated?: string;
    publicAccessType?: string;
    storageTier?: string;
  }>;
}

export interface BatchResultItem {
  name: string;
  ok: boolean;
  action: string;
  error?: string;
}

export interface BatchResponse {
  namespace: string;
  results: BatchResultItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OciApiService {
  constructor(private readonly http: HttpClient) {}

  health(): Observable<{ ok: boolean }> {
    return this.http.get<{ ok: boolean }>('/api/oci/health');
  }

  getNamespace(region?: string): Observable<{ namespace: string }> {
    let params = new HttpParams();
    if (region) params = params.set('region', region);
    return this.http.get<{ namespace: string }>('/api/oci/namespace', { params });
  }

  listBuckets(args: { region?: string; compartmentId: string; namespace?: string }): Observable<ListBucketsResponse> {
    let params = new HttpParams().set('compartmentId', args.compartmentId);
    if (args.region) params = params.set('region', args.region);
    if (args.namespace) params = params.set('namespace', args.namespace);
    return this.http.get<ListBucketsResponse>('/api/oci/buckets', { params });
  }

  batchCreate(body: any): Observable<BatchResponse> {
    return this.http.post<BatchResponse>('/api/oci/buckets/batchCreate', body);
  }

  batchDelete(body: any): Observable<BatchResponse> {
    return this.http.post<BatchResponse>('/api/oci/buckets/batchDelete', body);
  }
}

