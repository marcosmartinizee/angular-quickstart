import { Component, OnInit } from '@angular/core';
import { OciApiService, Bucket } from '../../services/oci-api.service';

@Component({
  selector: 'app-bucket-manager',
  templateUrl: './bucket-manager.component.html',
  styleUrls: ['./bucket-manager.component.css']
})
export class BucketManagerComponent implements OnInit {
  buckets: Bucket[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  isInitialized = false;

  // Create bucket form
  newBucketName = '';
  newBucketSubdomain = '';
  creating = false;

  // Delete confirmation
  deletingBucket: string | null = null;

  constructor(private ociService: OciApiService) { }

  ngOnInit(): void {
    this.checkInitialization();
  }

  checkInitialization(): void {
    this.ociService.checkHealth().subscribe({
      next: (response) => {
        this.isInitialized = response.initialized;
        if (this.isInitialized) {
          this.loadBuckets();
        }
      },
      error: (error) => {
        console.error('Health check failed:', error);
        this.showMessage('Backend server is not running. Please start the server.', 'error');
      }
    });
  }

  loadBuckets(): void {
    this.loading = true;
    this.message = '';

    this.ociService.listBuckets().subscribe({
      next: (response) => {
        this.buckets = response.buckets;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.error || 'Failed to load buckets', 'error');
      }
    });
  }

  createBucket(): void {
    if (!this.newBucketName.trim()) {
      this.showMessage('Bucket name is required', 'error');
      return;
    }

    this.creating = true;
    this.message = '';

    const request = {
      bucketName: this.newBucketName.trim(),
      subdomain: this.newBucketSubdomain.trim() || undefined
    };

    this.ociService.createBucket(request).subscribe({
      next: (response) => {
        this.creating = false;
        this.showMessage(response.message || 'Bucket created successfully', 'success');
        this.newBucketName = '';
        this.newBucketSubdomain = '';
        this.loadBuckets();
      },
      error: (error) => {
        this.creating = false;
        this.showMessage(error.error?.error || 'Failed to create bucket', 'error');
      }
    });
  }

  confirmDelete(bucketName: string): void {
    this.deletingBucket = bucketName;
  }

  cancelDelete(): void {
    this.deletingBucket = null;
  }

  deleteBucket(bucketName: string): void {
    this.message = '';

    this.ociService.deleteBucket(bucketName).subscribe({
      next: (response) => {
        this.showMessage(response.message || 'Bucket deleted successfully', 'success');
        this.deletingBucket = null;
        this.loadBuckets();
      },
      error: (error) => {
        this.showMessage(error.error?.error || 'Failed to delete bucket', 'error');
        this.deletingBucket = null;
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  getSubdomain(bucket: Bucket): string {
    return bucket.metadata?.['subdomain'] || 'N/A';
  }
}
