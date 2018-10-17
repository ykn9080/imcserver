var func = require('../function/api');

exports.readDataMy = (req, res) => {
  try {

    var p = makeparam(req);
    var dt = func.readData(p.path, p.dataname, p.keycode, p.keyvalue);

    res.send(dt);
  } catch (err) {
    res.send({"error": err});
  }
};
exports.ReadDataSingle = (req, res) => {
  try {
    var p = makeparam(req);
    var dt = func.readData(p.path, p.dataname, p.keycode, p.keyvalue);
    res.send(dt);
  } catch (err) {
    res.send({"error": err});
  }
};
exports.UpdateDataPost = (req, res) => {
  try {
    var p = makeparam(req);
    var dt = func.readData(p.path, p.dataname, p.keycode, p.keyvalue);
    res.send(dt);
  } catch (err) {
    res.send({"error": err});
  }
};
function makeparam(req) {
  //parse Request bodyParser
  var path = req.body.path,
    myinfo = req.body.myinfo,
    udata = req.body.udata,
    dataname = req.body.dataname,
    keycode = req.body.keycode,
    keyvalue = req.body.keyvalue;
  if (typeof dataname == "undefined")     dataname = "";
  if (typeof udata == "undefined")     udata = "";
  if (typeof keycode == "undefined")     keycode = "";
  if (typeof keyvalue == "undefined")     keyvalue = "";
  if (typeof myinfo == "undefined")     myinfo = "";
  var spath = func.findpathread(path, myinfo);

  return {path: spath, dataname: dataname, keycode: keycode, keyvalue: keyvalue, udata: udata}

}
