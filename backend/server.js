const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const common = require('oci-common');
const os = require('oci-objectstorage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración del proveedor OCI usando API Key
let provider;
let objectStorageClient;

function initializeOCIClient(config) {
  try {
    // Configurar el proveedor con las credenciales del API token
    provider = new common.SimpleAuthenticationDetailsProvider(
      config.tenancy,
      config.user,
      config.fingerprint,
      config.privateKey,
      null,
      common.Region.fromRegionId(config.region)
    );

    // Crear cliente de Object Storage
    objectStorageClient = new os.ObjectStorageClient({
      authenticationDetailsProvider: provider
    });

    console.log('Cliente OCI inicializado correctamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar cliente OCI:', error);
    return false;
  }
}

// Endpoint para configurar las credenciales
app.post('/api/config', (req, res) => {
  const { tenancy, user, fingerprint, privateKey, region, compartmentId } = req.body;

  if (!tenancy || !user || !fingerprint || !privateKey || !region || !compartmentId) {
    return res.status(400).json({
      success: false,
      message: 'Faltan parámetros de configuración requeridos'
    });
  }

  const config = {
    tenancy,
    user,
    fingerprint,
    privateKey,
    region,
    compartmentId
  };

  if (initializeOCIClient(config)) {
    // Guardar compartmentId para uso posterior
    app.locals.compartmentId = compartmentId;
    app.locals.namespace = null; // Se obtendrá dinámicamente

    res.json({
      success: true,
      message: 'Configuración guardada exitosamente'
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Error al configurar el cliente OCI'
    });
  }
});

// Obtener el namespace (requerido para operaciones)
async function getNamespace() {
  if (!objectStorageClient) {
    throw new Error('Cliente OCI no inicializado');
  }

  if (app.locals.namespace) {
    return app.locals.namespace;
  }

  const request = {};
  const response = await objectStorageClient.getNamespace(request);
  app.locals.namespace = response.value;
  return app.locals.namespace;
}

// Endpoint para listar buckets
app.get('/api/buckets', async (req, res) => {
  try {
    if (!objectStorageClient) {
      return res.status(400).json({
        success: false,
        message: 'Cliente OCI no configurado. Configure primero las credenciales.'
      });
    }

    const namespace = await getNamespace();
    const compartmentId = app.locals.compartmentId;

    const listBucketsRequest = {
      namespaceName: namespace,
      compartmentId: compartmentId
    };

    const response = await objectStorageClient.listBuckets(listBucketsRequest);

    res.json({
      success: true,
      buckets: response.items || []
    });
  } catch (error) {
    console.error('Error al listar buckets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al listar buckets'
    });
  }
});

// Endpoint para crear un bucket
app.post('/api/buckets', async (req, res) => {
  try {
    if (!objectStorageClient) {
      return res.status(400).json({
        success: false,
        message: 'Cliente OCI no configurado. Configure primero las credenciales.'
      });
    }

    const { bucketName, subdomain, publicAccess } = req.body;

    if (!bucketName) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del bucket es requerido'
      });
    }

    const namespace = await getNamespace();
    const compartmentId = app.locals.compartmentId;

    // Configurar el bucket con o sin acceso público
    const createBucketDetails = {
      name: bucketName,
      compartmentId: compartmentId,
      publicAccessType: publicAccess ? 'ObjectRead' : 'NoPublicAccess',
      metadata: {}
    };

    // Agregar subdomain como metadata si se proporciona
    if (subdomain) {
      createBucketDetails.metadata.subdomain = subdomain;
    }

    const createBucketRequest = {
      namespaceName: namespace,
      createBucketDetails: createBucketDetails
    };

    const response = await objectStorageClient.createBucket(createBucketRequest);

    res.json({
      success: true,
      message: 'Bucket creado exitosamente',
      bucket: response.bucket
    });
  } catch (error) {
    console.error('Error al crear bucket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear bucket'
    });
  }
});

// Endpoint para crear múltiples buckets
app.post('/api/buckets/bulk', async (req, res) => {
  try {
    if (!objectStorageClient) {
      return res.status(400).json({
        success: false,
        message: 'Cliente OCI no configurado. Configure primero las credenciales.'
      });
    }

    const { buckets } = req.body;

    if (!Array.isArray(buckets) || buckets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de buckets'
      });
    }

    const namespace = await getNamespace();
    const compartmentId = app.locals.compartmentId;

    const results = [];

    for (const bucket of buckets) {
      try {
        const createBucketDetails = {
          name: bucket.bucketName,
          compartmentId: compartmentId,
          publicAccessType: bucket.publicAccess ? 'ObjectRead' : 'NoPublicAccess',
          metadata: {}
        };

        if (bucket.subdomain) {
          createBucketDetails.metadata.subdomain = bucket.subdomain;
        }

        const createBucketRequest = {
          namespaceName: namespace,
          createBucketDetails: createBucketDetails
        };

        const response = await objectStorageClient.createBucket(createBucketRequest);

        results.push({
          success: true,
          bucketName: bucket.bucketName,
          message: 'Creado exitosamente'
        });
      } catch (error) {
        results.push({
          success: false,
          bucketName: bucket.bucketName,
          message: error.message || 'Error al crear bucket'
        });
      }
    }

    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error('Error al crear buckets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear buckets'
    });
  }
});

// Endpoint para eliminar un bucket
app.delete('/api/buckets/:bucketName', async (req, res) => {
  try {
    if (!objectStorageClient) {
      return res.status(400).json({
        success: false,
        message: 'Cliente OCI no configurado. Configure primero las credenciales.'
      });
    }

    const { bucketName } = req.params;
    const namespace = await getNamespace();

    const deleteBucketRequest = {
      namespaceName: namespace,
      bucketName: bucketName
    };

    await objectStorageClient.deleteBucket(deleteBucketRequest);

    res.json({
      success: true,
      message: 'Bucket eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar bucket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar bucket'
    });
  }
});

// Endpoint para eliminar múltiples buckets
app.post('/api/buckets/bulk-delete', async (req, res) => {
  try {
    if (!objectStorageClient) {
      return res.status(400).json({
        success: false,
        message: 'Cliente OCI no configurado. Configure primero las credenciales.'
      });
    }

    const { bucketNames } = req.body;

    if (!Array.isArray(bucketNames) || bucketNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de nombres de buckets'
      });
    }

    const namespace = await getNamespace();
    const results = [];

    for (const bucketName of bucketNames) {
      try {
        const deleteBucketRequest = {
          namespaceName: namespace,
          bucketName: bucketName
        };

        await objectStorageClient.deleteBucket(deleteBucketRequest);

        results.push({
          success: true,
          bucketName: bucketName,
          message: 'Eliminado exitosamente'
        });
      } catch (error) {
        results.push({
          success: false,
          bucketName: bucketName,
          message: error.message || 'Error al eliminar bucket'
        });
      }
    }

    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error('Error al eliminar buckets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar buckets'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    configured: !!objectStorageClient
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
