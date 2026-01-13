const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");

const { createObjectStorageClientFromEnv } = require("./src/oci");
const {
  bulkCreateBuckets,
  bulkDeleteBuckets,
  generateBucketNames
} = require("./src/buckets");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function requireEnv(value, name) {
  if (!value) {
    const error = new Error(`Missing required env var: ${name}`);
    error.statusCode = 500;
    throw error;
  }
  return value;
}

function getOciConfigFromEnv() {
  const privateKey = process.env.OCI_PRIVATE_KEY || "";
  const privateKeyPath = process.env.OCI_PRIVATE_KEY_PATH || "";
  if (!privateKey && !privateKeyPath) {
    const error = new Error("Missing OCI private key. Set OCI_PRIVATE_KEY or OCI_PRIVATE_KEY_PATH");
    error.statusCode = 500;
    throw error;
  }

  return {
    tenancyOcid: requireEnv(process.env.OCI_TENANCY_OCID, "OCI_TENANCY_OCID"),
    userOcid: requireEnv(process.env.OCI_USER_OCID, "OCI_USER_OCID"),
    fingerprint: requireEnv(process.env.OCI_FINGERPRINT, "OCI_FINGERPRINT"),
    privateKey,
    privateKeyPath,
    passphrase: process.env.OCI_PRIVATE_KEY_PASSPHRASE || "",
    region: requireEnv(process.env.OCI_REGION, "OCI_REGION"),
    compartmentOcid: requireEnv(process.env.OCI_COMPARTMENT_OCID, "OCI_COMPARTMENT_OCID")
  };
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

app.get(
  "/api/health",
  asyncHandler(async (_req, res) => {
    res.json({ ok: true });
  })
);

app.get(
  "/api/namespace",
  asyncHandler(async (_req, res) => {
    const config = getOciConfigFromEnv();
    const { namespaceName } = await createObjectStorageClientFromEnv(config);
    res.json({ namespace: namespaceName });
  })
);

app.get(
  "/api/buckets",
  asyncHandler(async (_req, res) => {
    const config = getOciConfigFromEnv();
    const { client, namespaceName } = await createObjectStorageClientFromEnv(config);
    const response = await client.listBuckets({
      namespaceName,
      compartmentId: config.compartmentOcid,
      limit: 1000
    });
    res.json({ buckets: response.items || [] });
  })
);

app.post(
  "/api/generate",
  asyncHandler(async (req, res) => {
    const { subdomainPrefix, count, separator } = req.body || {};
    const names = generateBucketNames({
      subdomainPrefix: String(subdomainPrefix || "bucket"),
      count: Number(count || 1),
      separator: typeof separator === "string" ? separator : "-"
    });
    res.json({ names });
  })
);

app.post(
  "/api/buckets:create",
  asyncHandler(async (req, res) => {
    const config = getOciConfigFromEnv();
    const { client, namespaceName } = await createObjectStorageClientFromEnv(config);

    const { names, publicAccessType, storageTier } = req.body || {};
    const result = await bulkCreateBuckets({
      client,
      namespaceName,
      compartmentOcid: config.compartmentOcid,
      names: Array.isArray(names) ? names : [],
      publicAccessType,
      storageTier
    });

    res.json(result);
  })
);

app.post(
  "/api/buckets:delete",
  asyncHandler(async (req, res) => {
    const config = getOciConfigFromEnv();
    const { client, namespaceName } = await createObjectStorageClientFromEnv(config);

    const { names, force } = req.body || {};
    const result = await bulkDeleteBuckets({
      client,
      namespaceName,
      names: Array.isArray(names) ? names : [],
      force: Boolean(force)
    });

    res.json(result);
  })
);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode && Number.isFinite(err.statusCode) ? err.statusCode : 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Unknown error",
      statusCode
    }
  });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`OCI Buckets UI running on http://localhost:${port}`);
});
