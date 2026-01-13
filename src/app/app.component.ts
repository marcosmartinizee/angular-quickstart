import { Component, OnInit } from '@angular/core';
import { OciService, OCIConfig, CreateBucketRequest } from './services/oci.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'OCI Bucket Manager';

  // Estados de la aplicación
  currentView: 'config' | 'buckets' = 'config';
  isConfigured = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Configuración de OCI
  ociConfig: OCIConfig = {
    tenancy: '',
    user: '',
    fingerprint: '',
    privateKey: '',
    region: 'us-ashburn-1',
    compartmentId: ''
  };

  // Buckets
  buckets: any[] = [];
  selectedBuckets: Set<string> = new Set();

  // Crear buckets
  showCreateForm = false;
  newBucket: CreateBucketRequest = {
    bucketName: '',
    subdomain: '',
    publicAccess: false
  };

  // Crear múltiples buckets
  showBulkCreateForm = false;
  bulkBucketCount = 3;
  bulkBuckets: CreateBucketRequest[] = [];

  constructor(private ociService: OciService) {}

  ngOnInit() {
    this.checkHealth();
  }

  checkHealth() {
    this.ociService.checkHealth().subscribe({
      next: (response) => {
        this.isConfigured = response.configured;
        if (this.isConfigured) {
          this.currentView = 'buckets';
          this.loadBuckets();
        }
      },
      error: (error) => {
        console.error('Error al verificar estado del servidor:', error);
      }
    });
  }

  saveConfig() {
    this.loading = true;
    this.message = '';

    this.ociService.configureCredentials(this.ociConfig).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.isConfigured = true;
          this.currentView = 'buckets';
          this.showMessage('Configuración guardada exitosamente', 'success');
          this.loadBuckets();
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || 'Error al guardar configuración', 'error');
      }
    });
  }

  loadBuckets() {
    this.loading = true;
    this.ociService.listBuckets().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.buckets = response.buckets || [];
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || 'Error al cargar buckets', 'error');
      }
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
    this.showBulkCreateForm = false;
    this.newBucket = {
      bucketName: '',
      subdomain: '',
      publicAccess: false
    };
  }

  createBucket() {
    if (!this.newBucket.bucketName) {
      this.showMessage('El nombre del bucket es requerido', 'error');
      return;
    }

    this.loading = true;
    this.ociService.createBucket(this.newBucket).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.showMessage('Bucket creado exitosamente', 'success');
          this.showCreateForm = false;
          this.loadBuckets();
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || 'Error al crear bucket', 'error');
      }
    });
  }

  openBulkCreateForm() {
    this.showBulkCreateForm = true;
    this.showCreateForm = false;
    this.generateBulkBuckets();
  }

  generateBulkBuckets() {
    this.bulkBuckets = [];
    for (let i = 0; i < this.bulkBucketCount; i++) {
      this.bulkBuckets.push({
        bucketName: '',
        subdomain: '',
        publicAccess: false
      });
    }
  }

  createBucketsBulk() {
    const validBuckets = this.bulkBuckets.filter(b => b.bucketName.trim() !== '');

    if (validBuckets.length === 0) {
      this.showMessage('Debe ingresar al menos un nombre de bucket', 'error');
      return;
    }

    this.loading = true;
    this.ociService.createBucketsBulk({ buckets: validBuckets }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          const successful = response.results.filter((r: any) => r.success).length;
          const failed = response.results.filter((r: any) => !r.success).length;
          this.showMessage(`Creados: ${successful}, Fallidos: ${failed}`, 'success');
          this.showBulkCreateForm = false;
          this.loadBuckets();
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || 'Error al crear buckets', 'error');
      }
    });
  }

  toggleBucketSelection(bucketName: string) {
    if (this.selectedBuckets.has(bucketName)) {
      this.selectedBuckets.delete(bucketName);
    } else {
      this.selectedBuckets.add(bucketName);
    }
  }

  isSelected(bucketName: string): boolean {
    return this.selectedBuckets.has(bucketName);
  }

  selectAll() {
    if (this.selectedBuckets.size === this.buckets.length) {
      this.selectedBuckets.clear();
    } else {
      this.buckets.forEach(bucket => this.selectedBuckets.add(bucket.name));
    }
  }

  deleteSelected() {
    if (this.selectedBuckets.size === 0) {
      this.showMessage('Seleccione al menos un bucket para eliminar', 'error');
      return;
    }

    if (!confirm(`¿Está seguro de eliminar ${this.selectedBuckets.size} bucket(s)?`)) {
      return;
    }

    this.loading = true;
    const bucketNames = Array.from(this.selectedBuckets);

    this.ociService.deleteBucketsBulk({ bucketNames }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          const successful = response.results.filter((r: any) => r.success).length;
          const failed = response.results.filter((r: any) => !r.success).length;
          this.showMessage(`Eliminados: ${successful}, Fallidos: ${failed}`, 'success');
          this.selectedBuckets.clear();
          this.loadBuckets();
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || 'Error al eliminar buckets', 'error');
      }
    });
  }

  deleteBucket(bucketName: string) {
    if (!confirm(`¿Está seguro de eliminar el bucket "${bucketName}"?`)) {
      return;
    }

    this.loading = true;
    this.ociService.deleteBucket(bucketName).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.showMessage('Bucket eliminado exitosamente', 'success');
          this.loadBuckets();
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || 'Error al eliminar bucket', 'error');
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  goToConfig() {
    this.currentView = 'config';
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.showBulkCreateForm = false;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
