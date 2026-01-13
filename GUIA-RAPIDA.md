# Guía Rápida - OCI Bucket Manager

## Inicio Rápido (5 minutos)

### 1. Instalación

```bash
# Instalar dependencias del backend
cd backend
npm install

# Volver a la raíz e instalar dependencias del frontend
cd ..
npm install
```

### 2. Obtener Credenciales de OCI

1. Ve a Oracle Cloud Console → Perfil → **API Keys**
2. Click en **"Add API Key"**
3. Descarga la clave privada (archivo .pem)
4. Copia estos datos:
   - Tenancy OCID
   - User OCID
   - Fingerprint
   - Region

5. Obtén tu Compartment ID:
   - Identity → Compartments → Copia el OCID

### 3. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
> Servidor en http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm start
```
> App en http://localhost:4200

### 4. Configurar desde la Web

1. Abre http://localhost:4200
2. Pega tus credenciales en el formulario
3. Para la Private Key: abre el archivo .pem y copia TODO el contenido
4. Click en **"Guardar Configuración"**

### 5. Crear Buckets

#### Un bucket:
1. Click **"+ Crear Bucket"**
2. Nombre: `mi-primer-bucket`
3. Subdominio: `api.midominio.com` (opcional)
4. Click **"Crear"**

#### Múltiples buckets:
1. Click **"+ Crear Múltiples"**
2. Elige cantidad
3. Completa nombres
4. Click **"Crear Todos"**

### 6. Eliminar Buckets

- **Individual**: Click "Eliminar" en la fila
- **Múltiple**:
  1. Selecciona con checkboxes
  2. Click **"Eliminar Seleccionados"**

## Comandos Útiles

```bash
# Backend
cd backend
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo (con auto-reload)

# Frontend
npm start          # Iniciar aplicación Angular
npm run build      # Build de producción
npm test           # Ejecutar tests
```

## Estructura de Credenciales

```
Tenancy OCID:    ocid1.tenancy.oc1..aaaaaaaa...
User OCID:       ocid1.user.oc1..aaaaaaaa...
Fingerprint:     a1:b2:c3:d4:e5:f6:g7:h8:i9:j0:k1:l2:m3:n4:o5:p6
Region:          us-ashburn-1
Compartment ID:  ocid1.compartment.oc1..aaaaaaaa...
Private Key:     -----BEGIN RSA PRIVATE KEY-----
                 MIIEpAIBAAKCAQEA...
                 -----END RSA PRIVATE KEY-----
```

## Formato de Nombre de Bucket

✅ **Válido:**
- `my-bucket`
- `bucket-2024`
- `data-storage-01`

❌ **Inválido:**
- `My Bucket` (espacios)
- `bucket_name` (guiones bajos)
- `BUCKET` (mayúsculas)

## Troubleshooting Rápido

| Error | Solución |
|-------|----------|
| "Cliente OCI no configurado" | Configura credenciales primero |
| "BucketAlreadyExists" | Usa otro nombre de bucket |
| "Unauthorized" | Verifica fingerprint y clave privada |
| "Cannot GET /" en backend | Backend no está corriendo |
| CORS error | Inicia el backend primero |

## URLs Importantes

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/api/health
- Oracle Cloud Console: https://cloud.oracle.com

## Funcionalidades Clave

✨ **Crear**
- Individual con subdomain
- Múltiples simultáneamente
- Acceso público/privado

🗑️ **Eliminar**
- Individual
- Selección múltiple
- Confirmación de seguridad

📋 **Listar**
- Ver todos los buckets
- Información de acceso
- Subdominios asociados

⚙️ **Configurar**
- Credenciales OCI
- En memoria (seguro)
- Fácil reconfiguración

## Ejemplo de Uso Completo

```bash
# 1. Setup
cd backend && npm install
cd .. && npm install

# 2. Iniciar backend
cd backend
npm start &

# 3. Iniciar frontend
cd ..
npm start

# 4. Abrir navegador
# http://localhost:4200

# 5. Configurar credenciales (primera vez)
# 6. Crear buckets
# 7. Gestionar buckets
```

## Siguientes Pasos

1. Lee el README-OCI-MANAGER.md completo
2. Revisa la documentación del backend en backend/README.md
3. Experimenta con la API REST directamente
4. Personaliza los estilos según tu marca

## Soporte

- 📖 Docs OCI: https://docs.oracle.com/en-us/iaas/Content/Object/home.htm
- 🔑 API Keys: https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm
- 💬 OCI SDK JS: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm

---

**¡Listo para gestionar buckets!** 🚀
