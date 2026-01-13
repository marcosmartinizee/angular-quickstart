import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OciBucketService, BucketInfo, BucketCreateRequest } from '../../services/oci-bucket.service';

@Component({
  selector: 'app-bucket-manager',
  templateUrl: './bucket-manager.component.html',
  styleUrls: ['./bucket-manager.component.css']
})
export class BucketManagerComponent implements OnInit {
  bucketForm: FormGroup;
  buckets: BucketInfo[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  displayedColumns: string[] = ['name', 'subdomain', 'createdDate', 'actions'];

  constructor(
    private fb: FormBuilder,
    private ociBucketService: OciBucketService
  ) {
    this.bucketForm = this.fb.group({
      buckets: this.fb.array([this.createBucketFormGroup()])
    });
  }

  ngOnInit(): void {
    this.loadBuckets();
  }

  get bucketsFormArray(): FormArray {
    return this.bucketForm.get('buckets') as FormArray;
  }

  createBucketFormGroup(): FormGroup {
    return this.fb.group({
      bucketName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9-_]{1,254}$/)]],
      subdomain: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,62}[a-zA-Z0-9]$/)]],
      publicAccess: [false]
    });
  }

  addBucketField(): void {
    this.bucketsFormArray.push(this.createBucketFormGroup());
  }

  removeBucketField(index: number): void {
    if (this.bucketsFormArray.length > 1) {
      this.bucketsFormArray.removeAt(index);
    }
  }

  async createBuckets(): Promise<void> {
    if (this.bucketForm.invalid) {
      this.showMessage('Please fill all required fields correctly', 'error');
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      const requests: BucketCreateRequest[] = this.bucketsFormArray.value;
      const results = await this.ociBucketService.createMultipleBuckets(requests);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (failCount === 0) {
        this.showMessage(`Successfully created ${successCount} bucket(s)`, 'success');
        this.bucketForm.reset();
        this.bucketsFormArray.clear();
        this.bucketsFormArray.push(this.createBucketFormGroup());
      } else {
        this.showMessage(`Created ${successCount} bucket(s), ${failCount} failed`, 'error');
      }

      await this.loadBuckets();
    } catch (error: any) {
      this.showMessage(`Error: ${error.message}`, 'error');
    } finally {
      this.loading = false;
    }
  }

  async loadBuckets(): Promise<void> {
    this.loading = true;
    try {
      this.buckets = await this.ociBucketService.listBuckets();
    } catch (error: any) {
      this.showMessage(`Error loading buckets: ${error.message}`, 'error');
    } finally {
      this.loading = false;
    }
  }

  async deleteBucket(bucketName: string): Promise<void> {
    if (!confirm(`Are you sure you want to delete bucket "${bucketName}"?`)) {
      return;
    }

    this.loading = true;
    try {
      const result = await this.ociBucketService.deleteBucket(bucketName);
      
      if (result.success) {
        this.showMessage(result.message, 'success');
        await this.loadBuckets();
      } else {
        this.showMessage(`Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      this.showMessage(`Error: ${error.message}`, 'error');
    } finally {
      this.loading = false;
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  clearForm(): void {
    this.bucketForm.reset();
    this.bucketsFormArray.clear();
    this.bucketsFormArray.push(this.createBucketFormGroup());
  }
}
