const { models } = require("oci-objectstorage");

function validateBucketName(name) {
  if (typeof name !== "string") return "Bucket name must be a string";
  if (!name.length) return "Bucket name cannot be empty";
  if (name.length > 256) return "Bucket name too long";
  // OCI bucket names must be DNS-like and lowercase.
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name)) {
    return "Bucket name must be lowercase letters, numbers, hyphen; no leading/trailing hyphen";
  }
  return null;
}

function sanitizePrefix(prefix) {
  return String(prefix || "bucket")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, 40) || "bucket";
}

function generateBucketNames({ subdomainPrefix, count, separator }) {
  const safePrefix = sanitizePrefix(subdomainPrefix);
  const safeSep = typeof separator === "string" && separator.length ? separator : "-";
  const safeCount = Number.isFinite(count) ? count : 1;
  const normalizedCount = Math.max(1, Math.min(500, Math.floor(safeCount)));
  const now = new Date();
  const ymd = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(
    now.getUTCDate()
  ).padStart(2, "0")}`;

  const names = [];
  for (let i = 1; i <= normalizedCount; i += 1) {
    names.push(`${safePrefix}${safeSep}${ymd}${safeSep}${String(i).padStart(3, "0")}`);
  }
  return names;
}

async function bulkCreateBuckets({
  client,
  namespaceName,
  compartmentOcid,
  names,
  publicAccessType,
  storageTier
}) {
  const uniqueNames = Array.from(new Set((names || []).map((n) => String(n).trim().toLowerCase()))).filter(Boolean);
  const results = [];

  for (const name of uniqueNames) {
    const error = validateBucketName(name);
    if (error) {
      results.push({ name, ok: false, error });
      continue;
    }

    const createBucketDetails = {
      name,
      compartmentId: compartmentOcid,
      publicAccessType: publicAccessType || models.CreateBucketDetails.PublicAccessType.NoPublicAccess,
      storageTier: storageTier || models.CreateBucketDetails.StorageTier.Standard
    };

    try {
      await client.createBucket({ namespaceName, createBucketDetails });
      results.push({ name, ok: true });
    } catch (e) {
      results.push({ name, ok: false, error: e && e.message ? e.message : String(e) });
    }
  }

  return {
    ok: results.every((r) => r.ok),
    created: results.filter((r) => r.ok).map((r) => r.name),
    results
  };
}

async function bulkDeleteBuckets({ client, namespaceName, names, force }) {
  const uniqueNames = Array.from(new Set((names || []).map((n) => String(n).trim()))).filter(Boolean);
  const results = [];

  for (const name of uniqueNames) {
    const normalized = name.toLowerCase();
    const error = validateBucketName(normalized);
    if (error) {
      results.push({ name: normalized, ok: false, error });
      continue;
    }

    try {
      await client.deleteBucket({ namespaceName, bucketName: normalized });
      results.push({ name: normalized, ok: true });
    } catch (e) {
      if (force) {
        results.push({
          name: normalized,
          ok: false,
          error: e && e.message ? e.message : String(e)
        });
      } else {
        results.push({
          name: normalized,
          ok: false,
          error: (e && e.message ? e.message : String(e)) + " (use Force to continue)"
        });
      }
    }
  }

  return {
    ok: results.every((r) => r.ok),
    deleted: results.filter((r) => r.ok).map((r) => r.name),
    results
  };
}

module.exports = {
  bulkCreateBuckets,
  bulkDeleteBuckets,
  generateBucketNames
};

