import { Component, OnInit } from '@angular/core';
import { OciApiService, OCIConfig } from '../../services/oci-api.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  config: OCIConfig = {
    tenancy: '',
    user: '',
    fingerprint: '',
    privateKey: '',
    region: 'us-phoenix-1',
    compartmentId: ''
  };

  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  isInitialized = false;

  regions = [
    'us-phoenix-1',
    'us-ashburn-1',
    'eu-frankfurt-1',
    'eu-zurich-1',
    'uk-london-1',
    'ca-toronto-1',
    'ap-tokyo-1',
    'ap-seoul-1',
    'ap-mumbai-1',
    'ap-sydney-1',
    'sa-saopaulo-1'
  ];

  constructor(private ociService: OciApiService) { }

  ngOnInit(): void {
    this.checkInitialization();
    this.loadSavedConfig();
  }

  checkInitialization(): void {
    this.ociService.checkHealth().subscribe({
      next: (response) => {
        this.isInitialized = response.initialized;
      },
      error: (error) => {
        console.error('Health check failed:', error);
      }
    });
  }

  loadSavedConfig(): void {
    const savedConfig = localStorage.getItem('oci_config');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (e) {
        console.error('Failed to load saved config:', e);
      }
    }
  }

  saveConfig(): void {
    localStorage.setItem('oci_config', JSON.stringify(this.config));
  }

  onSubmit(): void {
    this.loading = true;
    this.message = '';
    this.messageType = '';

    this.ociService.initializeOCI(this.config).subscribe({
      next: (response) => {
        this.loading = false;
        this.isInitialized = true;
        this.message = `Successfully connected to OCI! Namespace: ${response.namespace}`;
        this.messageType = 'success';
        this.saveConfig();
      },
      error: (error) => {
        this.loading = false;
        this.isInitialized = false;
        this.message = error.error?.error || 'Failed to connect to OCI. Please check your credentials.';
        this.messageType = 'error';
      }
    });
  }

  clearConfig(): void {
    this.config = {
      tenancy: '',
      user: '',
      fingerprint: '',
      privateKey: '',
      region: 'us-phoenix-1',
      compartmentId: ''
    };
    localStorage.removeItem('oci_config');
    this.message = 'Configuration cleared';
    this.messageType = 'success';
  }
}
