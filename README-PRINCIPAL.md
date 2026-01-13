# 🚀 OCI Bucket Manager

Sistema completo de gestión de buckets para **Oracle Cloud Infrastructure (OCI)** con interfaz gráfica web moderna.

---

## ⚡ Inicio Rápido (3 pasos)

```bash
# 1. Instalar
./install.sh

# 2. Ejecutar
./run-dev.sh

# 3. Abrir navegador
# http://localhost:4200
```

---

## 📚 Documentación

### 🌟 Comienza Aquí

| Archivo | Para Quién | Contenido |
|---------|------------|-----------|
| **[START-HERE.md](START-HERE.md)** | Todos | ⚡ Inicio rápido visual (3 pasos) |
| **[INSTRUCCIONES.md](INSTRUCCIONES.md)** | Usuarios | 📖 Guía completa paso a paso |
| **[PROYECTO-COMPLETADO.md](PROYECTO-COMPLETADO.md)** | Desarrolladores | ✅ Checklist de lo implementado |

### 📖 Guías Detalladas

| Archivo | Contenido |
|---------|-----------|
| **[GUIA-RAPIDA.md](GUIA-RAPIDA.md)** | Inicio rápido en 5 minutos |
| **[EJEMPLO-CREDENCIALES.md](EJEMPLO-CREDENCIALES.md)** | Formato y ejemplos de credenciales OCI |
| **[README-OCI-MANAGER.md](README-OCI-MANAGER.md)** | Documentación técnica completa |
| **[RESUMEN-PROYECTO.md](RESUMEN-PROYECTO.md)** | Resumen ejecutivo del proyecto |
| **[backend/README.md](backend/README.md)** | Documentación del API REST |

---

## ✨ Características

### 🔐 Configuración con API Key
- Interfaz web para credenciales OCI
- Conexión segura mediante API Token
- Validación en tiempo real

### 📦 Gestión de Buckets

**Crear:**
- ✅ Individual: Un bucket a la vez
- ✅ Múltiple: Hasta 50 buckets simultáneos
- ✅ Con subdominios personalizados
- ✅ Acceso público o privado

**Eliminar:**
- ✅ Individual: Bucket por bucket
- ✅ Múltiple: Selección masiva
- ✅ Confirmación de seguridad

**Listar:**
- ✅ Ver todos los buckets
- ✅ Información detallada
- ✅ Actualización en tiempo real

---

## 🏗️ Arquitectura

```
┌─────────────┐
│  Navegador  │  ← Usuario
└──────┬──────┘
       │
       ↓ HTTP
┌─────────────┐
│   Angular   │  Puerto 4200
│  (Frontend) │
└──────┬──────┘
       │
       ↓ REST API
┌─────────────┐
│   Express   │  Puerto 3000
│  (Backend)  │
└──────┬──────┘
       │
       ↓ OCI SDK
┌─────────────┐
│ Oracle Cloud│
│     (OCI)   │
└─────────────┘
```

---

## 💻 Requisitos

- **Node.js** 14+ ([Descargar](https://nodejs.org))
- **npm** (incluido con Node.js)
- **Cuenta Oracle Cloud** con acceso a Object Storage
- **Credenciales de API de OCI** (API Key)

---

## 📦 Instalación

### Método 1: Automático (Recomendado)

```bash
./install.sh
```

### Método 2: Manual

```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

---

## 🚀 Ejecución

### Método 1: Automático

```bash
./run-dev.sh
```

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

---

## 🔑 Configuración de OCI

### Obtener Credenciales

1. Ve a [Oracle Cloud Console](https://cloud.oracle.com)
2. **Perfil** → **User Settings** → **API Keys**
3. **Add API Key** → **Generate API Key Pair**
4. **Download Private Key** (guarda el archivo .pem)
5. Copia la configuración mostrada

### Datos Necesarios

- Tenancy OCID
- User OCID
- API Key Fingerprint
- Region (ej: us-ashburn-1)
- Compartment ID
- Private Key (contenido del .pem)

**Guía detallada:** [EJEMPLO-CREDENCIALES.md](EJEMPLO-CREDENCIALES.md)

---

## 🎯 Uso

### 1. Configurar

1. Abre http://localhost:4200
2. Ingresa tus credenciales de OCI
3. Haz clic en "Guardar Configuración"

### 2. Crear Buckets

**Individual:**
1. Click en "+ Crear Bucket"
2. Nombre: `mi-bucket`
3. Subdominio (opcional): `api.example.com`
4. Click "Crear"

**Múltiple:**
1. Click en "+ Crear Múltiples"
2. Elige cantidad (1-50)
3. Completa información
4. Click "Crear Todos"

### 3. Eliminar Buckets

**Individual:**
- Click en "Eliminar" en la fila del bucket

**Múltiple:**
1. Selecciona buckets con checkboxes
2. Click "Eliminar Seleccionados"
3. Confirma la operación

---

## 🛠️ Tecnologías

### Backend
- Node.js
- Express
- OCI SDK (Oracle Cloud Infrastructure)
- CORS

### Frontend
- Angular 13
- TypeScript
- RxJS
- CSS3

---

## 📊 Estructura del Proyecto

```
proyecto/
├── 📁 backend/              Backend Node.js + Express
│   ├── server.js           API REST principal
│   ├── package.json        Dependencias
│   └── README.md           Docs del backend
│
├── 📁 src/                 Frontend Angular
│   └── app/
│       ├── services/       Cliente API
│       ├── *.component.ts  Lógica
│       ├── *.component.html Template
│       └── *.component.css Estilos
│
├── 📄 START-HERE.md        ⭐ Inicio rápido
├── 📄 INSTRUCCIONES.md     📖 Guía completa
├── 📄 GUIA-RAPIDA.md       ⚡ Quick start
├── 📄 EJEMPLO-CREDENCIALES.md 🔑 Ayuda credenciales
├── 📄 README-OCI-MANAGER.md 🛠️ Docs técnicas
├── 📄 RESUMEN-PROYECTO.md  📊 Resumen
├── 📄 PROYECTO-COMPLETADO.md ✅ Checklist
│
├── 🔧 install.sh           Script instalación
└── 🚀 run-dev.sh           Script ejecución
```

---

## 🎨 Interfaz

- ✨ Diseño moderno con gradientes
- 📱 Responsive (móvil, tablet, desktop)
- 🎯 Interfaz intuitiva
- ⚡ Feedback visual constante
- 🔔 Notificaciones de éxito/error
- ⏳ Indicadores de carga

---

## 🔒 Seguridad

- ✅ Credenciales solo en memoria
- ✅ No persisten en disco
- ✅ CORS configurado
- ✅ Validación de entrada
- ✅ Confirmaciones de operaciones destructivas

---

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| "Node.js no instalado" | Instala desde https://nodejs.org |
| "Cliente OCI no configurado" | Configura credenciales en la web |
| "BucketAlreadyExists" | El nombre ya existe, usa otro |
| "Unauthorized" | Verifica fingerprint y private key |
| CORS error | Asegúrate de iniciar el backend primero |

**Más ayuda:** [INSTRUCCIONES.md](INSTRUCCIONES.md) → Sección "Solución de Problemas"

---

## 📞 Recursos

### Documentación Oracle
- [OCI Object Storage](https://docs.oracle.com/en-us/iaas/Content/Object/home.htm)
- [OCI API Keys](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)
- [OCI SDK JavaScript](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)

### Consola Oracle Cloud
- https://cloud.oracle.com

---

## 🎯 Lo Que Puedes Hacer

✅ Crear buckets individuales con subdominios
✅ Crear múltiples buckets simultáneamente (hasta 50)
✅ Eliminar buckets individuales
✅ Eliminar múltiples buckets seleccionados
✅ Listar todos tus buckets de OCI
✅ Configurar acceso público/privado
✅ Ver información detallada de cada bucket
✅ Gestionar buckets desde una interfaz web moderna

---

## 📋 Checklist de Inicio

Antes de comenzar, asegúrate de tener:

- [ ] Node.js instalado (v14+)
- [ ] Cuenta de Oracle Cloud
- [ ] Credenciales de API de OCI
- [ ] Private Key descargada
- [ ] Dependencias instaladas (`./install.sh`)
- [ ] Servidores ejecutándose (`./run-dev.sh`)
- [ ] Navegador abierto en http://localhost:4200

---

## 🏆 Características del Proyecto

- ✅ Sistema completo y funcional
- ✅ Código limpio y organizado
- ✅ Documentación exhaustiva
- ✅ Scripts de automatización
- ✅ Manejo robusto de errores
- ✅ Diseño moderno y responsive
- ✅ API REST bien diseñada
- ✅ Listo para producción (con mejoras de seguridad)

---

## 🎓 Para Empezar

### Si eres nuevo:
1. Lee [START-HERE.md](START-HERE.md)
2. Sigue [INSTRUCCIONES.md](INSTRUCCIONES.md)

### Si necesitas ayuda rápida:
- Lee [GUIA-RAPIDA.md](GUIA-RAPIDA.md)

### Si necesitas credenciales:
- Consulta [EJEMPLO-CREDENCIALES.md](EJEMPLO-CREDENCIALES.md)

### Si quieres detalles técnicos:
- Revisa [README-OCI-MANAGER.md](README-OCI-MANAGER.md)

---

## 🚀 Próximos Pasos

1. ✅ Ejecuta `./install.sh`
2. ✅ Ejecuta `./run-dev.sh`
3. ✅ Abre http://localhost:4200
4. ✅ Configura tus credenciales
5. ✅ ¡Gestiona tus buckets!

---

## ⚡ URLs Importantes

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health
- **Oracle Cloud Console:** https://cloud.oracle.com

---

## 📝 Notas

- Las credenciales se almacenan solo en memoria
- Se requiere reiniciar el servidor backend para cambiar credenciales
- Los nombres de buckets deben ser únicos globalmente en OCI
- Solo se pueden eliminar buckets vacíos

---

## 🎉 ¡Todo Listo!

El proyecto está **100% completo y funcional**.

Incluye:
- ✅ Backend con API REST
- ✅ Frontend con Angular
- ✅ Interfaz gráfica moderna
- ✅ Operaciones individuales y masivas
- ✅ Documentación completa
- ✅ Scripts de automatización

**¡Comienza a gestionar tus buckets de Oracle Cloud ahora!** 🚀

---

*Versión 1.0.0 - Enero 2026*
