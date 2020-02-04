#!/bin/bash
# ex code) dockerinstall server
# docker hub에서 image pull한후 compose up함

SVR_OR_CLIENT=$1
COMPOSE_DIR="imcclient"
CONTAINER_IMC="imcc1"
if [ $SVR_OR_CLIENT == "server" ] 
then
	COMPOSE_DIR="imcserver"
	CONTAINER_IMC="imc1"
fi
#which host?
SERVER_SRC="namubuntu"
if [ $(hostname)=="imcserver" ]
then
	SERVER_SRC="docean"
fi


echo "Remote Exec2) pull images from Dockerhub"
docker login --username=yknam --password=ykn9080
docker-compose up -d

echo " Changing configuration of container"

docker exec -i ${CONTAINER_IMC} sh -c "sed -i 's+const current_url=server_url.*+sconst current_url=server_url.${SERVER_SRC}+g' config/index.js"
docker exec -i ${CONTAINER_IMC} sh -c "sed -i 's+datasrc:basic.mongodb.*+datasrc:basic.mongodb.${SERVER_SRC}+g' config/index.js"