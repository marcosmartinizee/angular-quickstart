# 🚀 START HERE - OCI Bucket Manager

## ⚡ Instalación en 3 Pasos

### 1️⃣ Instalar Dependencias

```bash
./install.sh
```

O manualmente:
```bash
cd backend && npm install && cd .. && npm install
```

### 2️⃣ Ejecutar Aplicación

```bash
./run-dev.sh
```

O manualmente:
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
npm start
```

### 3️⃣ Abrir en Navegador

```
http://localhost:4200
```

---

## 🔑 Necesitas Credenciales de OCI

### Obtener API Key (2 minutos):

1. Ve a: https://cloud.oracle.com
2. **Perfil** → **User Settings** → **API Keys**
3. **Add API Key** → **Generate API Key Pair**
4. **Download Private Key** (guarda el archivo .pem)
5. **Copia** la configuración mostrada

### Obtener Compartment ID:

**Identity & Security** → **Compartments** → Copia el **OCID**

---

## 📝 Configurar en la Web

1. Abre http://localhost:4200
2. Pega tus credenciales:
   - Tenancy OCID
   - User OCID
   - Fingerprint
   - Region
   - Compartment ID
   - Private Key (todo el contenido del .pem)
3. **Guardar Configuración**

---

## ✅ Uso Rápido

### Crear un Bucket:
1. **+ Crear Bucket**
2. Nombre: `mi-bucket`
3. **Crear**

### Crear Múltiples Buckets:
1. **+ Crear Múltiples**
2. Elige cantidad
3. Completa nombres
4. **Crear Todos**

### Eliminar Buckets:
- Individual: **Eliminar** en la fila
- Múltiple: Selecciona → **Eliminar Seleccionados**

---

## 📚 Documentación Completa

| Archivo | Contenido |
|---------|-----------|
| **INSTRUCCIONES.md** | 📖 Guía completa paso a paso |
| **GUIA-RAPIDA.md** | ⚡ Inicio rápido detallado |
| **EJEMPLO-CREDENCIALES.md** | 🔑 Ayuda con credenciales |
| **README-OCI-MANAGER.md** | 🛠️ Documentación técnica |
| **RESUMEN-PROYECTO.md** | 📊 Resumen del proyecto |

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "Node.js no instalado" | Instala desde https://nodejs.org |
| "Cliente OCI no configurado" | Configura credenciales primero |
| "BucketAlreadyExists" | Usa otro nombre de bucket |
| "Unauthorized" | Verifica fingerprint y private key |
| CORS error | Inicia el backend primero |

---

## 🎯 Lo Que Puedes Hacer

✅ Crear buckets individuales con subdominios
✅ Crear múltiples buckets simultáneamente (hasta 50)
✅ Eliminar buckets individuales
✅ Eliminar múltiples buckets seleccionados
✅ Listar todos tus buckets
✅ Configurar acceso público/privado
✅ Ver información de cada bucket

---

## 📞 URLs Útiles

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health
- **Oracle Cloud:** https://cloud.oracle.com

---

## 🎨 Características

🔒 Configuración segura con API Key
📝 Interfaz gráfica moderna
⚡ Operaciones rápidas y masivas
🎯 Gestión completa de buckets
📱 Diseño responsive
✨ Feedback visual constante

---

## ⚙️ Estructura de Credenciales

```json
{
  "tenancy": "ocid1.tenancy.oc1..aaaaaaaaxxx...",
  "user": "ocid1.user.oc1..aaaaaaaaxxx...",
  "fingerprint": "a1:b2:c3:d4:e5:f6:07:08:09:0a:1b:2c:3d:4e:5f:60",
  "region": "us-ashburn-1",
  "compartmentId": "ocid1.compartment.oc1..aaaaaaaaxxx...",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
}
```

---

## 🚀 Todo Listo!

1. ✅ Instala con `./install.sh`
2. ✅ Ejecuta con `./run-dev.sh`
3. ✅ Abre http://localhost:4200
4. ✅ Configura tus credenciales
5. ✅ ¡Gestiona tus buckets!

---

**Para más información, lee INSTRUCCIONES.md** 📖

**¡Feliz gestión de buckets!** 🎉
