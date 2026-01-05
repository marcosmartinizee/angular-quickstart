# Cómo Obtener la Extensión MacroMaster

## Situación Actual

El archivo `MacroMaster-Chrome-Extension.zip` (39 KB) está creado en:
```
/vercel/sandbox/MacroMaster-Chrome-Extension.zip
```

## Problema
Este es un entorno sandbox que no puede generar enlaces de descarga HTTP directos.

## Soluciones

### Solución 1: Acceso al Sistema de Archivos
Si tienes acceso directo al sistema de archivos donde se ejecuta este sandbox:
1. Navega a `/vercel/sandbox/`
2. Descarga `MacroMaster-Chrome-Extension.zip`
3. Extrae el archivo
4. Instala en Chrome siguiendo las instrucciones en `INSTRUCCIONES-INSTALACION.md`

### Solución 2: Instalar sin Empaquetar
Si tienes acceso al directorio `/vercel/sandbox/chrome-extension/`:
1. Abre Chrome y ve a `chrome://extensions/`
2. Activa "Modo de desarrollador"
3. Click en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `/vercel/sandbox/chrome-extension/`

### Solución 3: Recrear Manualmente
Todos los archivos fuente están disponibles. Puedes:
1. Ver cada archivo individualmente
2. Crear una carpeta local en tu computadora
3. Copiar el contenido de cada archivo
4. Instalar la extensión

### Solución 4: Usar un Servicio de Transferencia
Si este sandbox tiene capacidad de red saliente, podríamos:
1. Subir el archivo a un servicio temporal como transfer.sh
2. Obtener un enlace de descarga temporal

---

## Archivos Incluidos en la Extensión

La extensión contiene 22 archivos:
- manifest.json (configuración)
- background.js (servicio en segundo plano)
- content.js (script de contenido)
- popup.html/js (interfaz emergente)
- sidebar.html/js (panel lateral)
- options.html/js (página de opciones)
- injected.js (script inyectado)
- icons/ (5 iconos en diferentes tamaños)
- README.md, LICENSE, documentación

**Tamaño total:** 39 KB (muy ligero)

---

## ¿Necesitas Ayuda?

Si ninguna de estas opciones funciona, puedo:
1. Mostrarte el contenido completo de cada archivo para copiar manualmente
2. Intentar usar un servicio de transferencia de archivos
3. Crear un repositorio Git con todos los archivos
