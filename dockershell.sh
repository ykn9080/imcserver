#! /bin/bash

echo "Step1: Change mongodb source"
ipa=$(hostname)

case "$ipa" in
imcserver) sed -i 's+datasrc:basic.mongodb.local+datasrc:basic.mongodb.docean+g' config/index.js;;
namubuntu) sed -i 's+datasrc:basic.mongodb.local+datasrc:basic.mongodb.namubuntu+g' config/index.js;;
*) a="not registerd system!!";;
esac

echo "Step2: Create Volumes"
arr=("mongodbdata" "jsondata" "svrnode_modules")
for var in "${arr[@]}"
do
  docker volume create  $var
done

echo "Step3: docker-compose up"
docker-compose up --build -d 
