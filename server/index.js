const express = require("express");
const cors = require("cors");
const oci = require("oci-sdk");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`Missing required env var: ${name}`);
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function createAuthProvider() {
  const configFilePath = process.env.OCI_CONFIG_FILE || undefined;
  const profile = process.env.OCI_PROFILE || undefined;
  return new oci.ConfigFileAuthenticationDetailsProvider(configFilePath, profile);
}

function createObjectStorageClient(regionId) {
  const provider = createAuthProvider();
  const client = new oci.objectstorage.ObjectStorageClient({ authenticationDetailsProvider: provider });
  client.region = oci.common.Region.fromRegionId(regionId);
  return client;
}

function normalizeBucketName(input) {
  const cleaned = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  // OCI bucket naming rules are similar to DNS-ish rules.
  // We'll keep it safe and short.
  return cleaned.slice(0, 63);
}

function expandBucketNames({ subdomains, template, explicitBucketNames }) {
  if (Array.isArray(explicitBucketNames) && explicitBucketNames.length > 0) {
    return explicitBucketNames.map(normalizeBucketName).filter(Boolean);
  }

  const tpl = template && template.trim() ? template.trim() : "{subdomain}";
  const subs = Array.isArray(subdomains) ? subdomains : [];

  const bucketNames = subs
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .map((subdomain) => normalizeBucketName(tpl.replaceAll("{subdomain}", subdomain)));

  return [...new Set(bucketNames)].filter(Boolean);
}

app.get("/api/oci/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/oci/namespace", async (req, res, next) => {
  try {
    const region = String(req.query.region || "").trim() || getRequiredEnv("OCI_REGION");
    const client = createObjectStorageClient(region);
    const response = await client.getNamespace({});
    res.json({ namespace: response.value });
  } catch (err) {
    next(err);
  }
});

app.get("/api/oci/buckets", async (req, res, next) => {
  try {
    const region = String(req.query.region || "").trim() || getRequiredEnv("OCI_REGION");
    const compartmentId = String(req.query.compartmentId || "").trim() || getRequiredEnv("OCI_COMPARTMENT_ID");
    const namespaceName = String(req.query.namespace || "").trim();
    const client = createObjectStorageClient(region);

    const namespace = namespaceName || (await client.getNamespace({})).value;
    const response = await client.listBuckets({ compartmentId, namespaceName: namespace });

    res.json({
      namespace,
      buckets: (response.items || []).map((b) => ({
        name: b.name,
        createdBy: b.createdBy,
        timeCreated: b.timeCreated,
        publicAccessType: b.publicAccessType,
        storageTier: b.storageTier,
      })),
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/oci/buckets/batchCreate", async (req, res, next) => {
  try {
    const region = String(req.body?.region || "").trim() || getRequiredEnv("OCI_REGION");
    const compartmentId = String(req.body?.compartmentId || "").trim() || getRequiredEnv("OCI_COMPARTMENT_ID");
    const namespaceName = String(req.body?.namespace || "").trim();
    const publicAccessType = req.body?.publicAccessType;
    const storageTier = req.body?.storageTier;

    const bucketNames = expandBucketNames({
      subdomains: req.body?.subdomains,
      template: req.body?.template,
      explicitBucketNames: req.body?.bucketNames,
    });

    const client = createObjectStorageClient(region);
    const namespace = namespaceName || (await client.getNamespace({})).value;

    const results = [];
    for (const name of bucketNames) {
      try {
        const createBucketDetails = {
          name,
          compartmentId,
          ...(publicAccessType ? { publicAccessType } : null),
          ...(storageTier ? { storageTier } : null),
        };

        await client.createBucket({ namespaceName: namespace, createBucketDetails });
        results.push({ name, ok: true, action: "created" });
      } catch (err) {
        results.push({ name, ok: false, action: "created", error: err?.message || String(err) });
      }
    }

    res.json({ namespace, results });
  } catch (err) {
    next(err);
  }
});

app.post("/api/oci/buckets/batchDelete", async (req, res, next) => {
  try {
    const region = String(req.body?.region || "").trim() || getRequiredEnv("OCI_REGION");
    const namespaceName = String(req.body?.namespace || "").trim();
    const client = createObjectStorageClient(region);
    const namespace = namespaceName || (await client.getNamespace({})).value;

    const bucketNames = expandBucketNames({
      subdomains: req.body?.subdomains,
      template: req.body?.template,
      explicitBucketNames: req.body?.bucketNames,
    });

    const results = [];
    for (const name of bucketNames) {
      try {
        await client.deleteBucket({ namespaceName: namespace, bucketName: name });
        results.push({ name, ok: true, action: "deleted" });
      } catch (err) {
        results.push({ name, ok: false, action: "deleted", error: err?.message || String(err) });
      }
    }

    res.json({ namespace, results });
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  const statusCode = Number(err?.statusCode) || 500;
  res.status(statusCode).json({
    ok: false,
    error: err?.message || String(err),
  });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`OCI bucket manager API listening on http://localhost:${port}`);
});

