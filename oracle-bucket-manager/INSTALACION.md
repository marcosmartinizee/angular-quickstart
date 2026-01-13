# 📖 Guía de Instalación Paso a Paso

Esta guía te ayudará a configurar Oracle Cloud Bucket Manager desde cero.

## Parte 1: Preparar Oracle Cloud Infrastructure

### 1.1 Crear cuenta en Oracle Cloud (si no tienes una)

1. Ir a https://www.oracle.com/cloud/free/
2. Registrarse para obtener cuenta gratuita (incluye $300 en créditos)
3. Completar el proceso de verificación

### 1.2 Obtener las credenciales necesarias

#### A. Tenancy OCID

1. Iniciar sesión en Oracle Cloud Console
2. Hacer clic en el menú de hamburguesa (☰) arriba a la izquierda
3. Ir a **Governance & Administration** → **Tenancy Details**
4. En **Tenancy Information**, encontrarás el **OCID**
5. Hacer clic en **Copy** y guardar en un lugar seguro

#### B. User OCID

1. Hacer clic en tu avatar/perfil (arriba a la derecha)
2. Seleccionar tu nombre de usuario
3. En **User Information**, encontrarás el **OCID**
4. Copiar y guardar

#### C. Compartment OCID

1. Menú → **Identity & Security** → **Compartments**
2. Puedes usar el compartment raíz o crear uno nuevo:
   - Para crear nuevo: clic en **Create Compartment**
   - Nombre: `bucket-manager` (o el que prefieras)
   - Descripción: "Compartment para gestión de buckets"
   - Clic en **Create Compartment**
3. Copiar el **OCID** del compartment

#### D. Object Storage Namespace

1. Menú → **Storage** → **Buckets**
2. En la parte superior de la página verás **Object Storage Namespace**
3. Copiar el valor (es una cadena única para tu tenancy)

#### E. Region

Tu región se muestra en la parte superior derecha de la consola (ej: US East (Ashburn))

Regiones comunes:
- `us-phoenix-1` - US West (Phoenix)
- `us-ashburn-1` - US East (Ashburn)
- `sa-saopaulo-1` - South America (São Paulo)
- `eu-frankfurt-1` - Germany (Frankfurt)
- `ap-tokyo-1` - Japan (Tokyo)

### 1.3 Crear API Key

1. Hacer clic en tu avatar → tu nombre de usuario
2. En el menú lateral izquierdo, clic en **API Keys**
3. Clic en **Add API Key**
4. Seleccionar **Generate API Key Pair**
5. Clic en **Download Private Key** - se descargará un archivo `.pem`
6. Clic en **Add** (NO cerrar la ventana aún)
7. Copiar el **Fingerprint** que se muestra
8. Cerrar el diálogo

### 1.4 Guardar la clave privada de forma segura

**En Linux/Mac:**
```bash
# Crear directorio para OCI
mkdir -p ~/.oci

# Mover la clave descargada
mv ~/Downloads/YOUR_KEY.pem ~/.oci/oci_api_key.pem

# Establecer permisos correctos (MUY IMPORTANTE)
chmod 600 ~/.oci/oci_api_key.pem
```

**En Windows:**
```powershell
# Crear directorio
mkdir $HOME\.oci

# Mover la clave
move $HOME\Downloads\YOUR_KEY.pem $HOME\.oci\oci_api_key.pem
```

## Parte 2: Configurar Políticas IAM (Permisos)

Para que tu usuario pueda crear y eliminar buckets:

1. Menú → **Identity & Security** → **Policies**
2. Asegurarte de estar en el compartment correcto
3. Clic en **Create Policy**
4. Configurar:
   - **Name**: `bucket-manager-policy`
   - **Description**: "Permite gestionar buckets"
   - **Compartment**: seleccionar tu compartment
5. En **Policy Builder**, clic en **Show manual editor**
6. Pegar las siguientes políticas:

```
Allow group Administrators to manage buckets in compartment bucket-manager
Allow group Administrators to manage objects in compartment bucket-manager
```

O si quieres dar acceso a tu usuario específico:

```
Allow user <tu-user-ocid> to manage buckets in compartment bucket-manager
Allow user <tu-user-ocid> to manage objects in compartment bucket-manager
```

7. Clic en **Create**

## Parte 3: Instalar y Configurar la Aplicación

### 3.1 Instalar Node.js (si no lo tienes)

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Mac:**
```bash
brew install node
```

**Windows:**
Descargar e instalar desde https://nodejs.org/

### 3.2 Verificar instalación

```bash
node --version
npm --version
```

### 3.3 Configurar el proyecto

```bash
# Navegar al directorio del proyecto
cd oracle-bucket-manager

# Instalar dependencias
npm install
```

### 3.4 Crear archivo de configuración

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo
nano .env  # o usa tu editor favorito
```

### 3.5 Completar las credenciales

Abrir `.env` y reemplazar con tus valores:

```env
# Tenancy OCID (del paso 1.2.A)
OCI_TENANCY_OCID=ocid1.tenancy.oc1..aaaaaaaXXXXXXXXXXXX

# User OCID (del paso 1.2.B)
OCI_USER_OCID=ocid1.user.oc1..aaaaaaaXXXXXXXXXXXX

# Fingerprint de tu API key (del paso 1.3)
OCI_FINGERPRINT=aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99

# Ruta a tu clave privada (del paso 1.4)
OCI_PRIVATE_KEY_PATH=~/.oci/oci_api_key.pem

# Tu región (del paso 1.2.E)
OCI_REGION=us-phoenix-1

# Compartment OCID (del paso 1.2.C)
OCI_COMPARTMENT_OCID=ocid1.compartment.oc1..aaaaaaaXXXXXXXXXXXX

# Object Storage Namespace (del paso 1.2.D)
OCI_NAMESPACE=tu-namespace

# Puerto del servidor (puedes dejarlo como está)
PORT=3000
```

**Guardar y cerrar el archivo**

## Parte 4: Ejecutar la Aplicación

### 4.1 Iniciar el servidor

```bash
npm start
```

Deberías ver:
```
OCI Client initialized successfully
Oracle Bucket Manager running on http://localhost:3000
Access the web interface at http://localhost:3000
```

### 4.2 Abrir en el navegador

Abrir tu navegador y ir a: http://localhost:3000

### 4.3 Probar la aplicación

1. **Refrescar la lista de buckets** - clic en "🔄 Refrescar Lista"
2. **Crear un bucket de prueba:**
   - Nombre: `test-bucket`
   - Subdominio: `demo`
   - Clic en "Crear Bucket"
3. Verificar que aparece en la lista como `demo-test-bucket`

## Solución de Problemas Comunes

### Error: "Cannot find module 'oci-objectstorage'"

```bash
npm install
```

### Error: "ENOENT: no such file or directory, open '.env'"

```bash
cp .env.example .env
# Luego editar .env con tus credenciales
```

### Error: "Failed to initialize OCI client"

Verificar:
1. Que todos los OCIDs en `.env` sean correctos
2. Que la ruta de la clave privada sea correcta
3. Que la clave privada tenga permisos correctos (600)

```bash
ls -la ~/.oci/oci_api_key.pem
# Debería mostrar: -rw------- ... oci_api_key.pem
```

### Error: "NotAuthenticated"

1. Verificar que el fingerprint en `.env` coincida con el de Oracle Cloud Console
2. Verificar que la clave privada sea la correcta
3. Regenerar la API key si es necesario

### Error: "NotAuthorizedOrNotFound"

1. Verificar las políticas IAM (Parte 2)
2. Confirmar que el compartment OCID sea correcto
3. Verificar que tu usuario tenga los permisos necesarios

### Puerto 3000 ya en uso

Cambiar el puerto en `.env`:
```env
PORT=8080
```

O detener el proceso que usa el puerto 3000:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Verificación Final

Lista de verificación:
- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Clave privada en `~/.oci/oci_api_key.pem`
- [ ] Permisos de la clave correctos (600)
- [ ] Políticas IAM configuradas
- [ ] Servidor iniciado correctamente
- [ ] Interfaz web accesible en http://localhost:3000
- [ ] Bucket de prueba creado exitosamente

## Próximos Pasos

Una vez que todo funcione:

1. **Crear buckets para producción** según tus necesidades
2. **Configurar subdominios** para diferentes entornos (dev, staging, prod)
3. **Integrar con tu aplicación** usando los API endpoints
4. **Configurar backups** de configuración importante
5. **Revisar costos** en Oracle Cloud Console

## Recursos de Ayuda

- **Documentación OCI**: https://docs.oracle.com/en-us/iaas/
- **Soporte OCI**: https://docs.oracle.com/en-us/iaas/Content/GSG/Tasks/contactingsupport.htm
- **Foros de OCI**: https://community.oracle.com/cloud/

---

Si tienes problemas no cubiertos en esta guía, revisa los logs del servidor para más detalles sobre el error.
