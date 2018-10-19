This directory contains a Jenkinsfile which can be used to build
imcserver using an OpenShift build pipeline.

To do this, run:

```bash
# create the nodejs example as usual
oc new-app https://github.com/ykn9080/imcserver

# now create the pipeline build controller from the openshift/pipeline
# subdirectory
oc new-app https://github.com/ykn9080/imcserver \
  --context-dir=openshift/pipeline --name imcserver-pipeline
```
