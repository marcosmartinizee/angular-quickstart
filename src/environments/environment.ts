export const environment = {
  production: false,
  oci: {
    // Configure your Oracle Cloud credentials here
    tenancyId: 'YOUR_TENANCY_OCID',
    userId: 'YOUR_USER_OCID',
    fingerprint: 'YOUR_KEY_FINGERPRINT',
    privateKey: 'YOUR_PRIVATE_KEY_PATH_OR_CONTENT',
    region: 'us-ashburn-1', // Change to your region
    compartmentId: 'YOUR_COMPARTMENT_OCID',
    namespace: 'YOUR_NAMESPACE'
  }
};
