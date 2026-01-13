# OCI Bucket Manager

Sistema completo para gestionar buckets en Oracle Cloud Infrastructure (OCI) con interfaz gráfica web.

## Características

- **Interfaz Gráfica Moderna**: Aplicación web construida con Angular
- **Gestión de Credenciales**: Configuración segura de API keys de OCI
- **Crear Buckets Individuales**: Crea un bucket a la vez con opciones personalizadas
- **Creación Masiva**: Crea múltiples buckets simultáneamente
- **Eliminación Individual y Masiva**: Elimina buckets de forma selectiva o múltiple
- **Gestión de Subdominios**: Asigna subdominios a cada bucket como metadata
- **Control de Acceso**: Configura acceso público o privado para cada bucket
- **Selección Múltiple**: Selecciona varios buckets para operaciones masivas
- **API REST**: Backend Node.js con endpoints RESTful

## Estructura del Proyecto

```
.
├── backend/                    # Servidor Node.js
│   ├── server.js              # API REST para OCI
│   ├── package.json           # Dependencias del backend
│   ├── .env.example           # Ejemplo de variables de entorno
│   └── README.md              # Documentación del backend
│
├── src/                       # Aplicación Angular
│   ├── app/
│   │   ├── services/
│   │   │   └── oci.service.ts # Servicio para comunicación con API
│   │   ├── app.component.ts   # Componente principal
│   │   ├── app.component.html # Template de la UI
│   │   └── app.component.css  # Estilos de la aplicación
│   └── ...
│
└── README-OCI-MANAGER.md      # Esta documentación
```

## Requisitos Previos

1. **Node.js**: Versión 14 o superior
2. **npm**: Gestor de paquetes de Node.js
3. **Cuenta de Oracle Cloud**: Con acceso a Object Storage
4. **API Key de OCI**: Credenciales generadas en la consola de OCI

## Instalación

### 1. Instalar Backend

```bash
cd backend
npm install
```

### 2. Instalar Frontend

```bash
npm install
```

## Configuración de OCI

### Obtener Credenciales de API

1. Inicia sesión en Oracle Cloud Console
2. Haz clic en tu perfil de usuario (esquina superior derecha)
3. Selecciona "API Keys"
4. Haz clic en "Add API Key"
5. Descarga la clave privada (.pem)
6. Copia el contenido de la configuración mostrada

Necesitarás los siguientes datos:
- **Tenancy OCID**: `ocid1.tenancy.oc1..aaaaaaaxxxxx`
- **User OCID**: `ocid1.user.oc1..aaaaaaaxxxxx`
- **Fingerprint**: `xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx`
- **Region**: `us-ashburn-1` (o tu región)
- **Compartment ID**: `ocid1.compartment.oc1..aaaaaaaxxxxx`
- **Private Key**: Contenido del archivo .pem

## Ejecución

### 1. Iniciar el Backend

```bash
cd backend
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### 2. Iniciar el Frontend

En otra terminal:

```bash
npm start
```

La aplicación Angular se abrirá en `http://localhost:4200`

## Uso de la Aplicación

### Primera Vez: Configuración

1. Al abrir la aplicación, verás la pantalla de configuración
2. Ingresa todas tus credenciales de OCI:
   - Tenancy OCID
   - User OCID
   - API Key Fingerprint
   - Region
   - Compartment ID
   - Private Key (pega el contenido completo del archivo .pem)
3. Haz clic en "Guardar Configuración"

### Crear un Bucket Individual

1. Haz clic en "+ Crear Bucket"
2. Ingresa:
   - **Nombre del Bucket**: Nombre único para el bucket
   - **Subdominio** (opcional): Ej. `api.example.com`
   - **Acceso Público**: Marca si quieres que sea público
3. Haz clic en "Crear"

### Crear Múltiples Buckets

1. Haz clic en "+ Crear Múltiples"
2. Selecciona la cantidad de buckets a crear (1-50)
3. Completa la información para cada bucket:
   - Nombre del bucket (requerido)
   - Subdominio (opcional)
   - Acceso público (checkbox)
4. Haz clic en "Crear Todos"

### Eliminar Buckets

#### Individual
- Haz clic en el botón "Eliminar" en la fila del bucket

#### Múltiple
1. Selecciona los checkboxes de los buckets a eliminar
2. Haz clic en "Eliminar Seleccionados"
3. Confirma la operación

### Otras Funcionalidades

- **Seleccionar Todos**: Selecciona/deselecciona todos los buckets
- **Actualizar**: Recarga la lista de buckets
- **Configuración**: Vuelve a la pantalla de configuración

## API REST Endpoints

### Configuración

**POST** `/api/config`
```json
{
  "tenancy": "ocid1.tenancy.oc1..example",
  "user": "ocid1.user.oc1..example",
  "fingerprint": "xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
  "region": "us-ashburn-1",
  "compartmentId": "ocid1.compartment.oc1..example"
}
```

### Listar Buckets

**GET** `/api/buckets`

Respuesta:
```json
{
  "success": true,
  "buckets": [
    {
      "name": "my-bucket",
      "timeCreated": "2024-01-13T10:00:00Z",
      "publicAccessType": "NoPublicAccess",
      "metadata": {
        "subdomain": "api.example.com"
      }
    }
  ]
}
```

### Crear Bucket Individual

**POST** `/api/buckets`
```json
{
  "bucketName": "my-bucket",
  "subdomain": "api.example.com",
  "publicAccess": false
}
```

### Crear Múltiples Buckets

**POST** `/api/buckets/bulk`
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

### Eliminar Bucket Individual

**DELETE** `/api/buckets/:bucketName`

### Eliminar Múltiples Buckets

**POST** `/api/buckets/bulk-delete`
```json
{
  "bucketNames": ["bucket1", "bucket2", "bucket3"]
}
```

### Health Check

**GET** `/api/health`

Respuesta:
```json
{
  "status": "ok",
  "configured": true
}
```

## Seguridad

- Las credenciales se almacenan solo en memoria durante la sesión
- No se guardan en disco ni en base de datos
- Usa HTTPS en producción
- Las claves privadas se manejan de forma segura
- Las operaciones destructivas requieren confirmación

## Notas Importantes

1. **Nombres de Buckets**: Deben ser únicos globalmente en OCI
2. **Eliminación de Buckets**: Solo se pueden eliminar buckets vacíos
3. **Límites de OCI**: Revisa los límites de tu cuenta en OCI
4. **Credenciales**: Las credenciales se pierden al reiniciar el servidor
5. **CORS**: El backend tiene CORS habilitado para desarrollo

## Solución de Problemas

### Error: "Cliente OCI no configurado"
- Asegúrate de configurar las credenciales primero
- Verifica que todas las credenciales sean correctas

### Error al crear bucket: "BucketAlreadyExists"
- El nombre del bucket ya existe en OCI
- Usa un nombre diferente

### Error: "Unauthorized"
- Verifica que tu API Key sea válida
- Confirma que el fingerprint coincida
- Asegúrate de que la clave privada esté completa

### Error: "Compartment not found"
- Verifica que el Compartment ID sea correcto
- Confirma que tienes permisos en ese compartment

## Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **OCI SDK**: SDK oficial de Oracle Cloud
- **CORS**: Middleware para CORS
- **dotenv**: Variables de entorno

### Frontend
- **Angular 13**: Framework frontend
- **TypeScript**: Lenguaje tipado
- **RxJS**: Programación reactiva
- **HttpClient**: Cliente HTTP de Angular

## Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Persistencia de configuración
- [ ] Upload de archivos a buckets
- [ ] Gestión de permisos de buckets
- [ ] Dashboard con estadísticas
- [ ] Logs de operaciones
- [ ] Exportar lista de buckets
- [ ] Filtrado y búsqueda de buckets

## Licencia

Este proyecto está disponible para uso personal y educativo.

## Soporte

Para problemas o preguntas relacionadas con OCI, consulta la documentación oficial:
- [OCI Object Storage Documentation](https://docs.oracle.com/en-us/iaas/Content/Object/home.htm)
- [OCI SDK for JavaScript](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)

## Autor

Creado para gestionar buckets de Oracle Cloud Infrastructure de forma eficiente.
