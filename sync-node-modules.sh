#!/bin/bash
CONTAINER_NAME="whatsapp-bot"
LOCAL_DIR="./node_modules"
CONTAINER_DIR="/app/node_modules"

echo "Copiando node_modules desde el contenedor '$CONTAINER_NAME'..."
docker cp $CONTAINER_NAME:$CONTAINER_DIR $LOCAL_DIR
echo "¡Sincronización completa!"