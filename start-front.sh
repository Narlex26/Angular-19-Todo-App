#!/bin/bash

# Nom du réseau
NETWORK_NAME="app_network"

# Vérifier si le réseau existe déjà
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "🔧 Creating Docker network: $NETWORK_NAME"
  docker network create $NETWORK_NAME
else
  echo "✅ Docker network '$NETWORK_NAME' already exists."
fi
# 2. Lancer Nginx (important : il doit rester au premier plan)
nginx -g 'daemon off;'