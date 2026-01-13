# 🗄️ Oracle Cloud Bucket Manager

Aplicación web con interfaz gráfica para gestionar buckets en Oracle Cloud Infrastructure (OCI) con soporte para múltiples subdominios.

## ✨ Características

- ✅ Crear buckets individuales con subdominios personalizados
- ✅ Crear múltiples buckets simultáneamente con diferentes subdominios
- ✅ Eliminar buckets individuales o múltiples seleccionados
- ✅ Listar y visualizar todos los buckets existentes
- ✅ Configurar opciones de acceso público y nivel de almacenamiento
- ✅ Interfaz gráfica web moderna y responsive
- ✅ Resultados en tiempo real de todas las operaciones

## 📋 Requisitos Previos

1. **Node.js** (versión 14 o superior)
2. **Cuenta de Oracle Cloud Infrastructure**
3. **Credenciales OCI configuradas:**
   - Tenancy OCID
   - User OCID
   - API Key (fingerprint y archivo .pem)
   - Region
   - Compartment OCID
   - Namespace

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd oracle-bucket-manager
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar credenciales de Oracle Cloud

#### Opción A: Archivo .env (Recomendado)

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
OCI_TENANCY_OCID=ocid1.tenancy.oc1..aaaaaaaa...
OCI_USER_OCID=ocid1.user.oc1..aaaaaaaa...
OCI_FINGERPRINT=aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99
OCI_PRIVATE_KEY_PATH=~/.oci/oci_api_key.pem
OCI_REGION=us-phoenix-1
OCI_COMPARTMENT_OCID=ocid1.compartment.oc1..aaaaaaaa...
OCI_NAMESPACE=your-namespace
PORT=3000
```

#### Opción B: Variables de entorno del sistema

Exportar las variables directamente:

```bash
export OCI_TENANCY_OCID="ocid1.tenancy.oc1..aaaaaaaa..."
export OCI_USER_OCID="ocid1.user.oc1..aaaaaaaa..."
# ... etc
```

### 4. Obtener tus credenciales OCI

#### Paso 1: Obtener Tenancy OCID
1. Acceder a Oracle Cloud Console
2. Ir a **Profile** → **Tenancy**
3. Copiar el **OCID** mostrado

#### Paso 2: Obtener User OCID
1. Ir a **Profile** → **User Settings**
2. Copiar el **OCID** del usuario

#### Paso 3: Crear API Key
1. En **User Settings**, ir a **API Keys**
2. Hacer clic en **Add API Key**
3. Seleccionar **Generate API Key Pair**
4. Descargar la clave privada (.pem)
5. Copiar el **Fingerprint** generado

#### Paso 4: Guardar la clave privada
```bash
mkdir -p ~/.oci
mv ~/Downloads/oci_api_key.pem ~/.oci/
chmod 600 ~/.oci/oci_api_key.pem
```

#### Paso 5: Obtener Region
- Tu región se muestra en la consola de OCI (ej: `us-phoenix-1`, `sa-saopaulo-1`)

#### Paso 6: Obtener Compartment OCID
1. Ir a **Identity** → **Compartments**
2. Seleccionar el compartment donde crearás los buckets
3. Copiar el **OCID**

#### Paso 7: Obtener Namespace
1. Ir a **Storage** → **Buckets**
2. El **Object Storage Namespace** se muestra en la parte superior

## 🎮 Uso

### Iniciar el servidor

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

### Usar la interfaz web

1. Abrir el navegador en `http://localhost:3000`

2. **Crear un bucket individual:**
   - Ingresar nombre del bucket
   - (Opcional) Agregar un subdominio
   - Seleccionar opciones de acceso y almacenamiento
   - Hacer clic en "Crear Bucket"

3. **Crear múltiples buckets:**
   - Ingresar nombre base para los buckets
   - Escribir los subdominios (uno por línea)
   - Seleccionar opciones comunes
   - Hacer clic en "Crear Múltiples Buckets"

4. **Eliminar buckets:**
   - Opción 1: Hacer clic en "🗑️ Eliminar" en un bucket específico
   - Opción 2: Seleccionar varios buckets con el checkbox y usar "Eliminar Seleccionados"

## 📡 API Endpoints

Si deseas integrar con otras aplicaciones:

### GET `/api/buckets`
Listar todos los buckets

### POST `/api/buckets/create`
```json
{
  "bucketName": "mi-bucket",
  "subdomain": "app1",
  "options": {
    "publicAccess": "NoPublicAccess",
    "storageTier": "Standard"
  }
}
```

### POST `/api/buckets/create-multiple`
```json
{
  "baseName": "storage",
  "subdomains": ["app1", "app2", "api"],
  "options": {
    "publicAccess": "NoPublicAccess",
    "storageTier": "Standard"
  }
}
```

### DELETE `/api/buckets/:bucketName`
Eliminar un bucket específico

### POST `/api/buckets/delete-multiple`
```json
{
  "bucketNames": ["app1-storage", "app2-storage"]
}
```

## 🔧 Opciones de Configuración

### Acceso Público
- `NoPublicAccess`: Sin acceso público (predeterminado)
- `ObjectRead`: Lectura pública de objetos
- `ObjectReadWithoutList`: Lectura sin listar

### Nivel de Almacenamiento
- `Standard`: Almacenamiento estándar (predeterminado)
- `Archive`: Almacenamiento de archivo (menor costo, mayor latencia)

## 🛡️ Seguridad

- **NUNCA** commits el archivo `.env` al control de versiones
- Mantener las claves privadas seguras (permisos 600)
- Usar políticas IAM restrictivas en OCI
- Considerar usar OCI Vault para almacenar credenciales en producción

## 📝 Ejemplos de Uso

### Ejemplo 1: Crear buckets para diferentes entornos

```
Nombre Base: myapp-storage
Subdominios:
dev
staging
prod
```

Resultado:
- `dev-myapp-storage`
- `staging-myapp-storage`
- `prod-myapp-storage`

### Ejemplo 2: Crear buckets para diferentes servicios

```
Nombre Base: data
Subdominios:
api
cdn
backup
logs
```

Resultado:
- `api-data`
- `cdn-data`
- `backup-data`
- `logs-data`

## 🐛 Solución de Problemas

### Error: "Failed to initialize OCI client"
- Verificar que todas las credenciales en `.env` sean correctas
- Confirmar que la clave privada existe en la ruta especificada
- Verificar permisos del archivo .pem (debe ser 600)

### Error: "NotAuthenticated"
- Verificar que el fingerprint coincida con el de tu API key en OCI
- Confirmar que el user OCID sea correcto
- Revisar que la clave privada no esté corrupta

### Error: "NotAuthorizedOrNotFound"
- Verificar que el compartment OCID sea correcto
- Confirmar que tu usuario tenga permisos para crear/eliminar buckets
- Revisar las políticas IAM en Oracle Cloud

### Error: "BucketAlreadyExists"
- El nombre del bucket ya existe
- Los nombres de bucket deben ser únicos en el namespace

## 📚 Recursos Adicionales

- [Documentación OCI SDK](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/nodesdk.htm)
- [Object Storage Documentation](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/objectstorageoverview.htm)
- [OCI API Keys](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

## 📄 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, crear un issue primero para discutir cambios mayores.

---

Desarrollado con ❤️ para facilitar la gestión de Oracle Cloud Storage
