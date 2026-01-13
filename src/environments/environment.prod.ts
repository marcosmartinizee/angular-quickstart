export const environment = {
  production: true,
  oci: {
    tenancyId: process.env['OCI_TENANCY_ID'] || '',
    userId: process.env['OCI_USER_ID'] || '',
    fingerprint: process.env['OCI_FINGERPRINT'] || '',
    privateKey: process.env['OCI_PRIVATE_KEY'] || '',
    region: process.env['OCI_REGION'] || 'us-ashburn-1',
    compartmentId: process.env['OCI_COMPARTMENT_ID'] || '',
    namespace: process.env['OCI_NAMESPACE'] || ''
  }
};
