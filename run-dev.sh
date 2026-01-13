#!/bin/bash

# Script para ejecutar backend y frontend en desarrollo

echo "========================================="
echo "  OCI Bucket Manager - Modo Desarrollo"
echo "========================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que node_modules existe
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠ Backend no está instalado. Ejecutando instalación...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ Frontend no está instalado. Ejecutando instalación...${NC}"
    npm install
fi

echo -e "${BLUE}Iniciando backend en puerto 3000...${NC}"
echo ""

# Iniciar backend en background
cd backend
npm start &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo ""

# Esperar 3 segundos para que el backend inicie
echo "Esperando que el backend inicie..."
sleep 3

echo -e "${BLUE}Iniciando frontend en puerto 4200...${NC}"
echo ""

# Iniciar frontend
npm start &
FRONTEND_PID=$!

echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Aplicación corriendo${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Backend:  ${BLUE}http://localhost:3000${NC}"
echo -e "Frontend: ${BLUE}http://localhost:4200${NC}"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servidores${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}Deteniendo servidores...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Servidores detenidos${NC}"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Esperar indefinidamente
wait
