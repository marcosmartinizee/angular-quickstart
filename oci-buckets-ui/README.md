# OCI Buckets UI

Interfaz web local para **crear / listar / eliminar** buckets de **Oracle Cloud Infrastructure (OCI) Object Storage** usando credenciales API Key.

## Requisitos

- Node.js (en este sandbox ya está)
- Credenciales de OCI (tenancy/user OCID + fingerprint + private key)
- Permisos IAM para Object Storage (crear/listar/eliminar buckets) en el compartment

## Configuración

1) Crea el archivo `.env`:

```bash
cp oci-buckets-ui/.env.example oci-buckets-ui/.env
```

2) Edita `oci-buckets-ui/.env` y completa:

- `OCI_TENANCY_OCID`
- `OCI_USER_OCID`
- `OCI_FINGERPRINT`
- `OCI_REGION` (ej: `us-ashburn-1`)
- `OCI_COMPARTMENT_OCID`
- Private key:
  - recomendado: `OCI_PRIVATE_KEY_PATH=/ruta/a/oci_api_key.pem`
  - alternativo: `OCI_PRIVATE_KEY` con `\n` literales

## Ejecutar

```bash
npm run oci-ui
```

Abre: `http://localhost:8787`

## Uso

- **Generar nombres**: usa prefijo + cantidad y luego “Generar nombres”.
- **Crear buckets**: pega nombres (uno por línea) y “Crear buckets”.
- **Eliminar buckets**: pega nombres y “Eliminar buckets”.
- **Lista de buckets**: click en un nombre lo copia al textarea.

## Notas importantes

- Los nombres se normalizan a minúsculas y deben ser tipo DNS: `a-z`, `0-9`, `-`.
- Si un bucket no se puede eliminar (por objetos dentro / políticas), el API devolverá error.

