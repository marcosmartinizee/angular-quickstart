import { Component } from '@angular/core';
import { OciApiService, BatchResponse, ListBucketsResponse } from '../oci-api.service';

type Status = 'idle' | 'loading' | 'error' | 'success';

@Component({
  selector: 'app-bucket-manager',
  templateUrl: './bucket-manager.component.html',
  styleUrls: ['./bucket-manager.component.css']
})
export class BucketManagerComponent {
  region = '';
  compartmentId = '';
  namespace = '';

  template = '{subdomain}';
  subdomainsText = '';
  bucketNamesText = '';

  publicAccessType = '';
  storageTier = '';

  status: Status = 'idle';
  message = '';

  listResponse?: ListBucketsResponse;
  batchResponse?: BatchResponse;

  constructor(private readonly api: OciApiService) {}

  private parseLines(value: string): string[] {
    return String(value || '')
      .split(/\r?\n/)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  private setLoading(msg: string) {
    this.status = 'loading';
    this.message = msg;
  }

  private setError(err: any) {
    this.status = 'error';
    this.message = err?.error?.error || err?.message || String(err);
  }

  private setSuccess(msg: string) {
    this.status = 'success';
    this.message = msg;
  }

  async onGetNamespace() {
    try {
      this.setLoading('Leyendo namespace...');
      const r = await this.api.getNamespace(this.region || undefined).toPromise();
      this.namespace = r?.namespace || '';
      this.setSuccess('Namespace listo.');
    } catch (e) {
      this.setError(e);
    }
  }

  async onListBuckets() {
    try {
      if (!this.compartmentId.trim()) throw new Error('compartmentId es requerido');
      this.setLoading('Listando buckets...');
      this.batchResponse = undefined;
      this.listResponse = await this.api
        .listBuckets({
          region: this.region || undefined,
          compartmentId: this.compartmentId.trim(),
          namespace: this.namespace || undefined
        })
        .toPromise();
      this.setSuccess(`Buckets: ${this.listResponse?.buckets?.length || 0}`);
    } catch (e) {
      this.setError(e);
    }
  }

  async onBatchCreate() {
    try {
      if (!this.compartmentId.trim()) throw new Error('compartmentId es requerido');
      this.setLoading('Creando buckets (batch)...');
      this.listResponse = undefined;
      this.batchResponse = await this.api
        .batchCreate({
          region: this.region || undefined,
          compartmentId: this.compartmentId.trim(),
          namespace: this.namespace || undefined,
          template: this.template || '{subdomain}',
          subdomains: this.parseLines(this.subdomainsText),
          bucketNames: this.parseLines(this.bucketNamesText),
          publicAccessType: this.publicAccessType || undefined,
          storageTier: this.storageTier || undefined
        })
        .toPromise();
      const okCount = (this.batchResponse?.results || []).filter((r) => r.ok).length;
      this.setSuccess(`Creación finalizada. OK: ${okCount}/${this.batchResponse?.results?.length || 0}`);
    } catch (e) {
      this.setError(e);
    }
  }

  async onBatchDelete() {
    try {
      this.setLoading('Eliminando buckets (batch)...');
      this.listResponse = undefined;
      this.batchResponse = await this.api
        .batchDelete({
          region: this.region || undefined,
          namespace: this.namespace || undefined,
          template: this.template || '{subdomain}',
          subdomains: this.parseLines(this.subdomainsText),
          bucketNames: this.parseLines(this.bucketNamesText)
        })
        .toPromise();
      const okCount = (this.batchResponse?.results || []).filter((r) => r.ok).length;
      this.setSuccess(`Eliminación finalizada. OK: ${okCount}/${this.batchResponse?.results?.length || 0}`);
    } catch (e) {
      this.setError(e);
    }
  }
}

