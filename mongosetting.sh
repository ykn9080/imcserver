#! /bin/sh

echo "Step1: Change mongodb source"
ipa=$(1)

case "$ipa" in
imcserver) sed -i 's+datasrc:basic.mongodb.local+datasrc:basic.mongodb.docean+g' config/index.js;;
namubuntu) sed -i 's+datasrc:basic.mongodb.local+datasrc:basic.mongodb.namubuntu+g' config/index.js;;
*) a="not registerd system!!";;
esac
