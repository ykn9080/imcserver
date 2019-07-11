var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var root = path.join("__dirname__", "../");

function findpathread(pathNfile, myinfo) {
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
        if (myinfos.length > 1) {
            staff = myinfos[1];
            if (staff != "")
                level = "staff";
        }
    }
    var filename = path.basename(pathNfile) //Path.GetFileName(abpath);
    var dir = path.dirname(pathNfile); //Path.GetDirectoryName(abpath);
    spath = path.join(root, dir, "/" + comp, "/" + staff, "/" + filename);
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
    if (level == "imc" | typeof myinfo == "undefined")
        spath = path.join(root, pathNfile);
    return spath;
}

function combinePath(pathNfile, myinfo) {
    //combine /data/json/imctable.json with acuvue,acuvue1(company,staff)
    //=> /data/json/acuvue/acuvue1/imctable.json
    var filename = path.basename(pathNfile);
    var dir = path.dirname(pathNfile);
    var comp = "",
        staff = "",
        spath = path.join(root, dir, "/" + filename);
    if (typeof myinfo != "undefined" && myinfo != "") {
        var myinfos = myinfo.split(',');
        comp = myinfos[0];
        if (comp != "") {
            spath = path.join(root, dir, "/" + comp, "/" + filename);
            if (myinfos.length > 1) {
                staff = myinfos[1];
                if (staff != "")
                    spath = path.join(root, dir, "/" + comp, "/" + staff, "/" + filename);
            }
        }
    }
    return spath;
}

function makedirfile(dir, name) {
    dir = dir.split('+').join('/');
    name = name.split('+').join('.');
    return path.join('__dirname', '../', dir, name);
}

function makeDirectory(pathNfile) {
    //mkdirp:if directory not exists create new
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



function makespath(pathNfile) {
    var rtn = path.join(root, pathNfile);
    return rtn;
}

function findDir(pathNfile) {
    //return directory path only
    return path.basename(pathNfile);
}

function findFilename(pathNfile) {
    //return file from full relative path
    return path.dirname(pathNfile);
}
//read all file with same file type in a directory
function readDataList(path,filetype){
    try
    {
        var abpath = makespath(path);
        var arr=[];
        var files=fs.readdirSync(abpath);

        files.forEach(file => {
          if(file.substring(file.indexOf('.')+1) ==filetype)
          arr.push(file);
        });
    }
    catch (err)
    {
        lreturn = "save fail" + err.name+":"+ err.message;
    }
    return arr.join(',');
}

// /**
//  * Remove directory recursively
//  * @param {string} dir_path
//  * @see https://stackoverflow.com/a/42505874/3027390
//  */
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}
var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
exports.makedirfile = (dir, name) => {
    dir = dir.split('+').join('/');
    name = name.split('+').join('.');
    return path.join('__dirname', '../', dir, name);
}

exports.jsonInit=(comp)=> {
    // when a comp start this service, create a new dir and copy imcdata,imctable,imclist,imcsetting in it.

    var rtn="";
    //req.body example:{"pathNfile":"/data/json/imctable.json","myinfo":"acuvue,acuvue2"}:
    var sourcePath1 = "/data/json";
    var targetPath1 = "/data/json/" + comp;
    var arr = ['imctable', 'imcdata', 'imclist','imcsetting'];
    var msg = "";
    for (var i in arr) {
        var filename = arr[i] + ".json";
        var src = path.join(root, sourcePath1, "/" + filename);
        var dest = path.join(root, targetPath1, "/" + filename);
        if (!fs.existsSync(dest)) {
            makeDirectory(dest)

            fs.copyFile(src, dest, (err) => {
                if (err) throw err;
                console.log(filename+" copied");
            });
            //makeDirectory(dest);
        }
        else{
             rtn+=filename+" exists";
        }
    }

}

function reqres(req,res){
  try {
    var p = mssqlProcParam(req);
    var dt = crud.readData(p.path, p.dataname, p.keycode, p.keyvalue);

     res.send(dt);
  } catch (err) {
    res.send({"error": err});
  }
}
function mssqlProcParam(req) {
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
  var spath = findpathread(path, myinfo);

  return {path: spath, myinfo:myinfo,dataname: dataname, keycode: keycode, keyvalue: keyvalue, udata: udata}

}

module.exports.findpathread = findpathread;
module.exports.combinePath = combinePath;
module.exports.makeDirectory = makeDirectory;
module.exports.makedirfile = makedirfile;

module.exports.makespath = makespath;
//module.exports.readFile = readFile;
module.exports.deleteFolderRecursive = deleteFolderRecursive;
module.exports.readDataList = readDataList;
module.exports.findDir = findDir;
module.exports.findFilename = findFilename;
module.exports.reqres = reqres;
module.exports.mssqlProcParam = mssqlProcParam;