# 📥 Cómo Descargar e Instalar MacroMaster en tu Navegador

## Archivo para Descargar

**📦 Archivo:** `MacroMaster-Chrome-Extension.zip` (39 KB)

Este archivo ZIP contiene toda la extensión lista para instalar.

---

## 🚀 Pasos de Instalación

### Opción 1: Instalación en Google Chrome

1. **Descargar el archivo**
   - Descarga el archivo `MacroMaster-Chrome-Extension.zip`
   - Guárdalo en tu computadora

2. **Extraer el archivo ZIP**
   - Haz clic derecho en `MacroMaster-Chrome-Extension.zip`
   - Selecciona "Extraer aquí" o "Extraer todo"
   - Se creará una carpeta llamada `chrome-extension`

3. **Abrir Chrome Extensions**
   - Abre Google Chrome
   - Escribe en la barra de direcciones: `chrome://extensions/`
   - Presiona Enter

4. **Activar Modo Desarrollador**
   - En la esquina superior derecha, activa el interruptor "Modo de desarrollador"

5. **Cargar la extensión**
   - Haz clic en el botón "Cargar extensión sin empaquetar"
   - Navega hasta la carpeta `chrome-extension` que extrajiste
   - Selecciona la carpeta y haz clic en "Seleccionar carpeta"

6. **¡Listo!**
   - La extensión MacroMaster aparecerá en tu lista de extensiones
   - Haz clic en el ícono de la extensión en la barra de herramientas para usarla

---

### Opción 2: Instalación en Microsoft Edge

1. **Descargar y extraer** (igual que en Chrome, pasos 1-2)

2. **Abrir Edge Extensions**
   - Abre Microsoft Edge
   - Escribe en la barra de direcciones: `edge://extensions/`
   - Presiona Enter

3. **Activar Modo Desarrollador**
   - En la parte inferior izquierda, activa "Modo de desarrollador"

4. **Cargar la extensión**
   - Haz clic en "Cargar descomprimida"
   - Selecciona la carpeta `chrome-extension`
   - Haz clic en "Seleccionar carpeta"

5. **¡Listo!**
   - La extensión estará instalada y lista para usar

---

### Opción 3: Instalación en Brave Browser

1. **Descargar y extraer** (igual que en Chrome, pasos 1-2)

2. **Abrir Brave Extensions**
   - Abre Brave Browser
   - Escribe en la barra de direcciones: `brave://extensions/`
   - Presiona Enter

3. **Activar Modo Desarrollador**
   - En la esquina superior derecha, activa "Modo de desarrollador"

4. **Cargar la extensión**
   - Haz clic en "Cargar extensión desempaquetada"
   - Selecciona la carpeta `chrome-extension`
   - Haz clic en "Seleccionar carpeta"

5. **¡Listo!**
   - La extensión estará instalada

---

## 📖 Cómo Usar la Extensión

### Primer Uso

1. **Abrir la extensión**
   - Haz clic en el ícono de MacroMaster en la barra de herramientas
   - Si no ves el ícono, haz clic en el ícono de extensiones (pieza de rompecabezas) y busca MacroMaster

2. **Panel de Control**
   - Verás tres pestañas principales:
     - **Record**: Para grabar nuevas macros
     - **Play**: Para reproducir macros guardadas
     - **Manage**: Para gestionar tus macros

### Grabar una Macro

1. Haz clic en la pestaña **Record**
2. Haz clic en el botón "Start Recording"
3. Realiza las acciones que quieres automatizar en la página web
4. Haz clic en "Stop Recording"
5. Dale un nombre a tu macro y guárdala

### Reproducir una Macro

1. Haz clic en la pestaña **Play**
2. Selecciona la macro que quieres ejecutar
3. Haz clic en "Play Macro"
4. La extensión reproducirá automáticamente todas las acciones

---

## ✨ Características Principales

- ✅ **Grabación de Macros**: Graba clicks, escritura, navegación
- ✅ **Reproducción Automática**: Ejecuta macros guardadas
- ✅ **Gestión de Macros**: Edita, elimina, importa y exporta macros
- ✅ **Espera Inteligente**: Espera a que los elementos estén disponibles
- ✅ **Extracción de Datos**: Extrae texto y atributos de páginas web
- ✅ **Formularios**: Automatiza el llenado de formularios
- ✅ **Compatible**: Chrome, Edge, Brave, Opera y otros navegadores Chromium

---

## 🔧 Solución de Problemas

### La extensión no aparece después de instalarla

- Verifica que el "Modo de desarrollador" esté activado
- Recarga la página de extensiones (presiona F5)
- Asegúrate de haber seleccionado la carpeta correcta (`chrome-extension`)

### Error: "Manifest file is invalid"

- Verifica que hayas extraído completamente el archivo ZIP
- Asegúrate de seleccionar la carpeta `chrome-extension`, no la carpeta padre

### La macro no se reproduce correctamente

- Verifica que la página web esté completamente cargada antes de reproducir
- Aumenta el tiempo de espera en la configuración de la macro
- Revisa que los selectores CSS sigan siendo válidos en la página

### Permisos

Si la extensión solicita permisos, haz clic en "Permitir". La extensión necesita:
- Acceso a las pestañas activas para grabar y reproducir acciones
- Almacenamiento local para guardar tus macros

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa el archivo `README.md` incluido en la extensión
2. Consulta `EXAMPLES.md` para ver ejemplos de uso
3. Lee `QUICKSTART.md` para una guía rápida

---

## 🔄 Actualizar la Extensión

Para actualizar a una nueva versión:

1. Descarga la nueva versión del archivo ZIP
2. Extrae en una nueva carpeta
3. Ve a `chrome://extensions/`
4. Haz clic en el botón de recargar (⟳) en la tarjeta de MacroMaster
5. O elimina la extensión antigua e instala la nueva

---

## 📁 Archivos Incluidos en el ZIP

```
chrome-extension/
├── manifest.json          (Configuración de la extensión)
├── background.js          (Servicio en segundo plano)
├── content.js             (Script de contenido)
├── popup.html             (Interfaz principal)
├── popup.js               (Lógica del popup)
├── sidebar.html           (Panel lateral)
├── sidebar.js             (Lógica del panel)
├── options.html           (Página de opciones)
├── options.js             (Configuración)
├── injected.js            (Script inyectado)
├── icons/                 (Iconos de la extensión)
├── README.md              (Documentación en inglés)
├── INSTALLATION.md        (Guía de instalación)
├── EXAMPLES.md            (Ejemplos de uso)
├── QUICKSTART.md          (Inicio rápido)
└── LICENSE                (Licencia MIT)
```

---

## ⚖️ Licencia

Esta extensión está bajo la Licencia MIT - libre para usar, modificar y distribuir.

---

## 🎉 ¡Disfruta Automatizando!

Ahora puedes automatizar tareas repetitivas en la web con MacroMaster. Graba una vez, reproduce infinitas veces.

**¡Ahorra tiempo y aumenta tu productividad!**
