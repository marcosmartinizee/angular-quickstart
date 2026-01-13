const fs = require("fs");

const common = require("oci-common");
const objectstorage = require("oci-objectstorage");

function normalizePrivateKey(privateKey) {
  if (!privateKey) return privateKey;

  // Allow env var to contain literal \n sequences.
  return privateKey.includes("\\n") ? privateKey.replace(/\\n/g, "\n") : privateKey;
}

function resolvePrivateKey({ privateKey, privateKeyPath }) {
  if (privateKeyPath) {
    return fs.readFileSync(privateKeyPath, "utf8");
  }
  return privateKey;
}

async function createObjectStorageClientFromEnv({
  tenancyOcid,
  userOcid,
  fingerprint,
  privateKey,
  privateKeyPath,
  passphrase,
  region
}) {
  const provider = new common.SimpleAuthenticationDetailsProvider(
    tenancyOcid,
    userOcid,
    fingerprint,
    normalizePrivateKey(resolvePrivateKey({ privateKey, privateKeyPath })),
    passphrase || "",
    common.Region.fromRegionId(region)
  );

  const client = new objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: provider
  });

  const namespaceResponse = await client.getNamespace({});

  return { client, namespaceName: namespaceResponse.value };
}

module.exports = {
  createObjectStorageClientFromEnv
};
