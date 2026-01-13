# OCI Bucket Manager - Backend

Backend para gestionar buckets en Oracle Cloud Infrastructure (OCI).

## Instalación

```bash
cd backend
npm install
```

## Configuración

Las credenciales de OCI se configuran desde la interfaz web. Necesitas:

1. **Tenancy OCID**: ID de tu tenancy en OCI
2. **User OCID**: ID de tu usuario
3. **Fingerprint**: Fingerprint de tu API key
4. **Private Key**: Tu clave privada RSA (en formato PEM)
5. **Region**: Región de OCI (ejemplo: us-ashburn-1)
6. **Compartment ID**: ID del compartment donde crear los buckets

### Cómo obtener las credenciales de API de OCI

1. Ingresa a la consola de Oracle Cloud
2. Ve a tu perfil de usuario (esquina superior derecha)
3. Selecciona "API Keys"
4. Genera una nueva API Key o usa una existente
5. Descarga la clave privada
6. Copia el Fingerprint
7. Obtén tu User OCID y Tenancy OCID desde la consola

## Ejecución

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## Endpoints

### POST /api/config
Configura las credenciales de OCI.

**Body:**
```json
{
  "tenancy": "ocid1.tenancy.oc1..example",
  "user": "ocid1.user.oc1..example",
  "fingerprint": "xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----",
  "region": "us-ashburn-1",
  "compartmentId": "ocid1.compartment.oc1..example"
}
```

### GET /api/buckets
Lista todos los buckets en el compartment.

### POST /api/buckets
Crea un nuevo bucket.

**Body:**
```json
{
  "bucketName": "my-bucket",
  "subdomain": "subdomain.example.com",
  "publicAccess": false
}
```

### POST /api/buckets/bulk
Crea múltiples buckets.

**Body:**
```json
{
  "buckets": [
    {
      "bucketName": "bucket1",
      "subdomain": "sub1.example.com",
      "publicAccess": false
    },
    {
      "bucketName": "bucket2",
      "subdomain": "sub2.example.com",
      "publicAccess": true
    }
  ]
}
```

### DELETE /api/buckets/:bucketName
Elimina un bucket específico.

### POST /api/buckets/bulk-delete
Elimina múltiples buckets.

**Body:**
```json
{
  "bucketNames": ["bucket1", "bucket2", "bucket3"]
}
```

### GET /api/health
Verifica el estado del servidor.

## Notas de Seguridad

- Las credenciales de API NO se guardan en disco, solo en memoria durante la sesión
- Asegúrate de proteger tu clave privada
- No compartas tus credenciales de API
- Usa variables de entorno en producción
