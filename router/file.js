var filefunc = require('../function/filefunc');
//var api=require('../controller/api');
module.exports = (app) => {
  app.post('/readfile', function(req, res) {
    //req.body example:{"pathNfile":"/data/json/imctable.json","myinfo":"acuvue,acuvue2"}:
    //=> search: 1. /data/json/acuvue/acuvue2/imctable.json 2. /data/json/acuvue/imctable.json, 3./data/json/imctable.json
    //{"pathNfile":"/data/json/imctable.json"}: without myinfo means just read /data/json/imctable.json
   var spath=filefunc.findpathread(req.body.pathNfile, req.body.myinfo);
      var file=filefunc.readFile(spath);
      res.send(file);
  });
  app.post('/savefile', function(req, res) {
     var spath=filefunc.combinePath(req.body.pathNfile, req.body.myinfo);
        filefunc.makeDirectory(spath);
      filefunc.writeFile(spath,req.body.udata);
  });
  app.delete('/deletefile', function(req,res){
     var spath=filefunc.combinePath(req.body.pathNfile, req.body.myinfo);
     console.log(spath);
     filefunc.deleteFolderRecursive(spath);
  });
   app.post('/jsonInit', function(req, res) {
    console.log(req.body.comp)
    var rtn=filefunc.jsonInit(req.body.comp);
    res.send(rtn);
  });
  //app.post('/jsonInit', api.jsonInit);

}
