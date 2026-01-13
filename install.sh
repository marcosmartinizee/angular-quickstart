#!/bin/bash

# Script de instalación para OCI Bucket Manager

echo "========================================="
echo "  OCI Bucket Manager - Instalación"
echo "========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js instalado: $NODE_VERSION${NC}"

# Verificar npm
echo -e "${BLUE}Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm instalado: $NPM_VERSION${NC}"
echo ""

# Instalar dependencias del backend
echo -e "${BLUE}Instalando dependencias del backend...${NC}"
cd backend
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ No se pudo acceder al directorio backend${NC}"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias del backend${NC}"
    exit 1
fi

cd ..
echo ""

# Instalar dependencias del frontend
echo -e "${BLUE}Instalando dependencias del frontend...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias del frontend${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✓ Instalación completada exitosamente${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo ""
echo "1. Obtén tus credenciales de Oracle Cloud Infrastructure:"
echo "   - Ve a: https://cloud.oracle.com"
echo "   - Perfil → API Keys → Add API Key"
echo "   - Descarga la clave privada (.pem)"
echo ""
echo "2. Inicia el backend:"
echo -e "   ${BLUE}cd backend && npm start${NC}"
echo ""
echo "3. En otra terminal, inicia el frontend:"
echo -e "   ${BLUE}npm start${NC}"
echo ""
echo "4. Abre tu navegador en:"
echo -e "   ${BLUE}http://localhost:4200${NC}"
echo ""
echo "5. Configura tus credenciales en la interfaz web"
echo ""
echo -e "${YELLOW}Documentación:${NC}"
echo "  - Guía completa: README-OCI-MANAGER.md"
echo "  - Guía rápida: GUIA-RAPIDA.md"
echo "  - Backend: backend/README.md"
echo ""
echo -e "${GREEN}¡Disfruta gestionando tus buckets de OCI! 🚀${NC}"
