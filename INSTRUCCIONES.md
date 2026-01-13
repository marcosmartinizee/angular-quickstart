# OCI Bucket Manager - Instrucciones de Instalación y Uso

## 📋 Índice

1. [Descripción](#descripción)
2. [Requisitos](#requisitos)
3. [Instalación Rápida](#instalación-rápida)
4. [Obtener Credenciales de OCI](#obtener-credenciales-de-oci)
5. [Ejecutar la Aplicación](#ejecutar-la-aplicación)
6. [Uso de la Interfaz](#uso-de-la-interfaz)
7. [Documentación Adicional](#documentación-adicional)
8. [Solución de Problemas](#solución-de-problemas)

---

## 📝 Descripción

**OCI Bucket Manager** es una aplicación web completa para gestionar buckets en Oracle Cloud Infrastructure (OCI) a través de una interfaz gráfica moderna.

### Características Principales:

✅ **Configuración mediante API Key de OCI**
- Conexión segura usando credenciales de API
- Configuración fácil desde la interfaz web

✅ **Crear Buckets**
- Individual: Crea un bucket a la vez
- Múltiple: Crea muchos buckets simultáneamente
- Asigna subdominios a cada bucket
- Configura acceso público o privado

✅ **Eliminar Buckets**
- Individual: Elimina buckets uno por uno
- Múltiple: Selecciona y elimina varios buckets
- Confirmación de seguridad antes de eliminar

✅ **Gestión Completa**
- Lista todos tus buckets
- Visualiza información de cada bucket
- Actualización en tiempo real

---

## 💻 Requisitos

Antes de comenzar, asegúrate de tener:

1. **Node.js** (versión 14 o superior)
   - Descarga desde: https://nodejs.org/

2. **npm** (incluido con Node.js)

3. **Cuenta de Oracle Cloud Infrastructure**
   - Con acceso a Object Storage
   - Permisos para crear/eliminar buckets

4. **Credenciales de API de OCI**
   - Tenancy OCID
   - User OCID
   - API Key Fingerprint
   - Private Key (archivo .pem)
   - Region
   - Compartment ID

---

## ⚡ Instalación Rápida

### Método 1: Script Automático (Recomendado)

```bash
./install.sh
```

Este script instala automáticamente todas las dependencias.

### Método 2: Manual

```bash
# 1. Instalar backend
cd backend
npm install

# 2. Volver a la raíz
cd ..

# 3. Instalar frontend
npm install
```

---

## 🔑 Obtener Credenciales de OCI

### Paso 1: Generar API Key

1. Ve a **Oracle Cloud Console**: https://cloud.oracle.com
2. Haz clic en tu **perfil** (icono en esquina superior derecha)
3. Selecciona **"User Settings"**
4. En el menú izquierdo: **"API Keys"**
5. Haz clic en **"Add API Key"**
6. Selecciona **"Generate API Key Pair"**
7. Haz clic en **"Download Private Key"**
   - Guarda el archivo `.pem` en lugar seguro
8. Haz clic en **"Add"**
9. **Copia** la configuración mostrada que incluye:
   - User
   - Fingerprint
   - Tenancy
   - Region

### Paso 2: Obtener Compartment ID

1. En Oracle Cloud Console, ve a:
   **Identity & Security** → **Compartments**
2. Haz clic en el compartment donde quieres crear buckets
3. Copia el **OCID** mostrado

**Nota:** También puedes usar el compartment root (usa el mismo Tenancy OCID)

### Paso 3: Preparar Private Key

1. Abre el archivo `.pem` descargado con un editor de texto
2. Copia **TODO** el contenido (incluyendo líneas BEGIN y END)
3. Lo pegarás en la interfaz web

Para más detalles, consulta: **EJEMPLO-CREDENCIALES.md**

---

## 🚀 Ejecutar la Aplicación

### Método 1: Script Automático

```bash
./run-dev.sh
```

Este script inicia automáticamente backend y frontend.

### Método 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Verificar que está funcionando:

- Backend: http://localhost:3000/api/health
- Frontend: http://localhost:4200

---

## 🎨 Uso de la Interfaz

### Primera Vez: Configuración

1. Abre tu navegador en: **http://localhost:4200**

2. Verás la pantalla de **"Configuración de OCI"**

3. Completa todos los campos:

   **Tenancy OCID:**
   ```
   ocid1.tenancy.oc1..aaaaaaaaxxx...
   ```

   **User OCID:**
   ```
   ocid1.user.oc1..aaaaaaaaxxx...
   ```

   **API Key Fingerprint:**
   ```
   a1:b2:c3:d4:e5:f6:07:08:09:0a:1b:2c:3d:4e:5f:60
   ```

   **Region:**
   ```
   us-ashburn-1
   ```

   **Compartment ID:**
   ```
   ocid1.compartment.oc1..aaaaaaaaxxx...
   ```

   **Private Key:**
   ```
   -----BEGIN RSA PRIVATE KEY-----
   MIIEpAIBAAKCAQEA...
   (todo el contenido del archivo .pem)
   ...
   -----END RSA PRIVATE KEY-----
   ```

4. Haz clic en **"Guardar Configuración"**

5. Si todo es correcto, serás redirigido a la vista de buckets

### Crear un Bucket Individual

1. Haz clic en **"+ Crear Bucket"**

2. Completa el formulario:
   - **Nombre del Bucket**: `mi-primer-bucket`
   - **Subdominio** (opcional): `api.midominio.com`
   - **Acceso Público**: Marca si quieres acceso público

3. Haz clic en **"Crear"**

### Crear Múltiples Buckets

1. Haz clic en **"+ Crear Múltiples"**

2. Selecciona cuántos buckets quieres crear (1-50)

3. Completa la información para cada bucket:
   - Nombre del bucket (requerido)
   - Subdominio (opcional)
   - Acceso público (checkbox)

4. Haz clic en **"Crear Todos"**

5. Verás un resumen de cuántos se crearon exitosamente

### Listar Buckets

- La lista de buckets se muestra automáticamente
- Cada bucket muestra:
  - Nombre
  - Fecha de creación
  - Tipo de acceso (Público/Privado)
  - Subdominio (si tiene)

### Eliminar Buckets

#### Individual:
- Haz clic en el botón **"Eliminar"** en la fila del bucket
- Confirma la eliminación

#### Múltiple:
1. Marca los **checkboxes** de los buckets a eliminar
2. Haz clic en **"Eliminar Seleccionados"**
3. Confirma la operación
4. Verás un resumen de cuántos se eliminaron

### Otras Funciones

- **Seleccionar Todos**: Marca/desmarca todos los buckets
- **Actualizar**: Recarga la lista de buckets
- **⚙ Configuración**: Vuelve a la pantalla de configuración

---

## 📚 Documentación Adicional

El proyecto incluye documentación completa:

1. **README-OCI-MANAGER.md**
   - Documentación técnica completa
   - Descripción de la arquitectura
   - API REST endpoints
   - Tecnologías utilizadas

2. **GUIA-RAPIDA.md**
   - Inicio rápido en 5 minutos
   - Comandos útiles
   - Troubleshooting rápido

3. **EJEMPLO-CREDENCIALES.md**
   - Formato exacto de cada credencial
   - Ejemplos detallados
   - Dónde encontrar cada dato
   - Guía paso a paso

4. **backend/README.md**
   - Documentación del backend
   - API endpoints detallados
   - Configuración del servidor

---

## 🔧 Solución de Problemas

### Error: "Node.js no instalado"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "Cliente OCI no configurado"
**Solución:**
1. Asegúrate de haber configurado las credenciales
2. Verifica que todas las credenciales sean correctas
3. Revisa que no haya espacios extras

### Error: "BucketAlreadyExists"
**Solución:**
- El nombre del bucket ya existe en OCI
- Los nombres de buckets son globalmente únicos
- Usa un nombre diferente

### Error: "Unauthorized" o "Invalid fingerprint"
**Solución:**
1. Verifica que el fingerprint sea exactamente el de la consola OCI
2. Confirma que la Private Key esté completa
3. Asegúrate de incluir las líneas BEGIN y END
4. Verifica que el User OCID sea correcto

### Error: "Compartment not found"
**Solución:**
1. Verifica que el Compartment ID sea correcto
2. Confirma que tienes permisos en ese compartment
3. Intenta usar el compartment root (Tenancy OCID)

### Error: "Cannot connect to localhost:3000"
**Solución:**
1. Asegúrate de que el backend esté corriendo
2. Verifica que no haya otro proceso usando el puerto 3000
3. Revisa los logs del backend para errores

### Error de CORS
**Solución:**
1. Asegúrate de iniciar el backend primero
2. El backend debe estar en puerto 3000
3. El frontend debe estar en puerto 4200

### El frontend no carga
**Solución:**
1. Verifica que las dependencias estén instaladas: `npm install`
2. Revisa la consola del navegador para errores
3. Asegúrate de que el puerto 4200 esté libre

---

## 🌐 Puertos Utilizados

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:4200

Si necesitas cambiar los puertos:

**Backend:** Edita `backend/server.js` o usa variable de entorno `PORT`

**Frontend:** Usa `ng serve --port XXXX`

---

## 📊 Estructura del Proyecto

```
oci-bucket-manager/
├── backend/                    # Servidor Node.js + Express
│   ├── server.js              # API REST principal
│   ├── package.json           # Dependencias backend
│   ├── .env.example           # Ejemplo de variables
│   └── README.md              # Docs del backend
│
├── src/                       # Aplicación Angular
│   ├── app/
│   │   ├── services/
│   │   │   └── oci.service.ts # Cliente API
│   │   ├── app.component.ts   # Lógica principal
│   │   ├── app.component.html # UI
│   │   └── app.component.css  # Estilos
│   └── ...
│
├── install.sh                 # Script de instalación
├── run-dev.sh                # Script de ejecución
├── README-OCI-MANAGER.md     # Documentación completa
├── GUIA-RAPIDA.md            # Guía rápida
├── EJEMPLO-CREDENCIALES.md   # Ejemplos de credenciales
└── INSTRUCCIONES.md          # Este archivo
```

---

## 🔒 Seguridad

⚠️ **Importantes Consideraciones de Seguridad:**

1. **Credenciales en Memoria:**
   - Las credenciales solo se guardan en memoria
   - No se persisten en disco
   - Se pierden al reiniciar el servidor

2. **Private Key:**
   - NUNCA compartas tu Private Key
   - NO la subas a GitHub
   - Guárdala en lugar seguro
   - Rótala periódicamente

3. **Producción:**
   - Usa HTTPS en producción
   - Implementa autenticación de usuarios
   - Usa variables de entorno
   - Restringe CORS apropiadamente

---

## 🚀 Próximos Pasos

Después de instalar y configurar:

1. ✅ Experimenta creando buckets de prueba
2. ✅ Prueba la creación masiva
3. ✅ Familiarízate con la interfaz
4. ✅ Lee la documentación completa
5. ✅ Personaliza según tus necesidades

---

## 📞 Recursos y Soporte

### Documentación Oficial de Oracle:
- [OCI Object Storage](https://docs.oracle.com/en-us/iaas/Content/Object/home.htm)
- [OCI API Keys](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)
- [OCI SDK JavaScript](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)

### Consola de Oracle Cloud:
- https://cloud.oracle.com

---

## ✅ Checklist de Instalación

Antes de comenzar a usar la aplicación, verifica:

- [ ] Node.js instalado (versión 14+)
- [ ] Dependencias del backend instaladas (`cd backend && npm install`)
- [ ] Dependencias del frontend instaladas (`npm install`)
- [ ] Credenciales de OCI obtenidas
- [ ] Private Key descargada y guardada
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 4200
- [ ] Navegador abierto en http://localhost:4200
- [ ] Credenciales configuradas en la interfaz web
- [ ] Conexión exitosa con OCI

---

**¡Listo para gestionar tus buckets de Oracle Cloud!** 🎉

Para más información, consulta los otros archivos de documentación incluidos en el proyecto.
