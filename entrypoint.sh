#!/bin/bash

echo "Navegando até a pasta do game"
cd /home/node/tic-tac-toe

if [ ! -d "/home/node/tic-tac-toe/node_modules/" ]; then
	echo "Instalando o game"
	npm install
fi

echo "Inicializando o game"
npm start &

echo "Inicializando o servidor python"
cd /home/node && \
python3 -m flask-server.run
exec "$@"