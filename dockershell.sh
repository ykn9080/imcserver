#! /bin/bash

echo "Step1: Change mongodb source"
ipa=$(hostname)

case "$ipa" in
imcserver) sed -i 's+datasrc:basic.mongodb.local+datasrc:basic.mongodb.docean+g' config/index.js;;
namubuntu) sed -i 's+datasrc:basic.mongodb.local+datasrc:basic.mongodb.namubuntu+g' config/index.js;;
*) a="not registerd system!!";;
esac

echo "Step2: Create Volumes"
for vol in ("mongodata" "jsondata" "svrnode_modules")
do
  docker volume create  ${vol}
done

echo "Step3: docker-compose up"
docker-compose up --build -d 
