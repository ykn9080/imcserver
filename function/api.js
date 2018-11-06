var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var root = path.join("__dirname__", "../");

function findpathread(relpath, myinfo) {

  //find json file at imc>company>staff level and return if exists or return uplevel
  var comp = "",
    staff = "",
    spath = "",
    level = "imc";
  if (myinfo != "") {
    var myinfos = myinfo.split(',');
    comp = myinfos[0];
    if (comp != "")
      level = "comp";
    if (myinfos.Length > 1) {
      staff = myinfos[1];
      if (staff != "")
        level = "staff";
      }
    }

  var filename = path.basename(relpath) //Path.GetFileName(abpath);
  var dir = path.dirname(relpath); //Path.GetDirectoryName(abpath);
  spath = path.join(root, dir, comp, staff, filename);
  //console.log("without /", spath)
  if (level == "staff") {
    if (!fs.existsSync(spath)) {
      level = "comp";
      spath = path.join(root, dir, "/" + comp, "/" + filename);
      //spath=path.join('__dirname', '../', dir, comp,filename);

    }
  }
  if (level == "comp") {
    if (!fs.existsSync(spath)) {
      level = "imc";
      spath = path.join(root, dir, "/" + filename);
      //spath=path.join('__dirname', '../', dir, filename);

    }
  }
  if (level == "imc")
    spath = path.join(root, relpath);
    //spath=path.join('__dirname', '../', relpath);

  return spath;
}

function makedirfile(dir, name) {
  dir = dir.split('+').join('/');
  name = name.split('+').join('.');

  return path.join('__dirname', '../', dir, name);
}
function makeDirectory(pathNfile) {
  var pth = path.dirname(pathNfile);
  mkdirp(pth, function(err) {
    if (err) {
      console.error(err);
      return false;
    } else {
      console.log('dir created');
      return true;
    }
  });
}
function readFile(pathNfile) {
  if (fs.existsSync(pathNfile)) {
    file = fs.readFileSync(pathNfile, 'utf8');
    if (file != "")
      file = JSON.parse(file);
    return file;
  }
  return false;

}
function writeFile(pathNfile, content) {
  console.log(content)
  if (typeof content == "object")
    content = JSON.stringify(content);

  fs.writeFile(pathNfile, content, function(err) {
    if (err) {
      console.log(err);
      return false;
    }
    return true;
  });
}

exports.makedirfile=(dir,name)=>{
    dir = dir.split('+').join('/');
    name = name.split('+').join('.');
  console.log(path.join('__dirname', '../', dir, name))
  return path.join('__dirname', '../', dir, name);
}

exports.readData=(pth,dataname,keycode,keyvalue)=>{
  var dt = JSON.parse(fs.readFileSync(pth, 'utf8'));
  console.log('readdata:',pth,dataname,keycode,keyvalue);
    if (dataname!="")
    dt = dt[dataname];

  if (keycode!="") {
    var dtt = dt.filter(function(usr) {
      return usr[keycode] == keyvalue;
    });
    if (dtt.length == 1)
      dt = dtt[0];
    else
      dt = dtt;
    }
    return dt;
}

module.exports.findpathread = findpathread;
module.exports.makeDirectory = makeDirectory;
module.exports.readFile = readFile;
module.exports.writeFile = writeFile;
