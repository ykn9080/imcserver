const formidable = require('formidable')
const path = require('path');
const fs = require('fs');
const mongodb = require('../database/mongodb.js');
var File = require('../model/allmodel.js');
const config = require('../config/index');
const excel = require('../database/excel');
var goog = require('../api/googleapis');

var uploadFile = (req, res) => {
    let drive="",keepFilename=false,maxsize=2;
    var user = req.user;
    if(req.headers.hasOwnProperty("drive")) drive=req.headers.drive;
    if(req.headers.hasOwnProperty("keepfilename")) keepFilename=req.headers.keepfilename;
    if(req.headers.hasOwnProperty("maxsize")) maxsize=req.headers.maxsize;
    //console.log("req.headers: ",req.headers)
    //console.log(req,"req body..................................",req.body)
    //var fileDir = path.join(__dirname, '../data/excel');
    var form = new formidable.IncomingForm();
    //console.log('form.uploadDir: ',form)
    var relpath = "/data/";
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '../data');
    form.keepExtensions = true;
    form.maxFieldsSize = maxsize * 1024 * 1024 //2MB
    form.hash = false;
    form.multiple = true;
    
    form.parse(req)
        .on('field', (name, field) => {
            switch (name) {
                case "dir":
                    //form.uploadDir =field;
                    //const spath=path.resolve(field);
                    relpath = field;
                    form.uploadDir = path.join(__dirname, '..' + field);
                    
                    const spath = path.resolve(form.uploadDir);
                    //console.log("field: ",path.join(__dirname, '..' + field),"spath: ",spath)
                    if (!fs.existsSync(spath))
                        fs.mkdirSync(spath);
                    break;
                case "size":
                    form.maxFieldsSize = field * 1024 * 1024;
                    break;
            }
        })
         /* this is where the renaming happens */
        .on ('fileBegin', function(name, file){
              //rename the incoming file to the file's name
              if(keepFilename)
              file.path = form.uploadDir + "/" + file.name;
        })
        .on('file', function(name, file) {
           // console.log("file:", file, "name: ", name)

        });
    form.on('end', async function(fields, files) { 
        //console.log(" 총 업로드 파일 갯수 == ", this.openedFiles.length,fields);
        
        console.log(this.openedFiles)
        var rtnarr = [],
            set = {};
        for (var i = 0; i < this.openedFiles.length; i++) {
            set = {};
            var temp_path = this.openedFiles[i].path;
            var tempfile = path.basename(temp_path);
            var file_name = this.openedFiles[i].name;
            var size = this.openedFiles[i].size;
            var type = this.openedFiles[i].type;
            set.filepath = "." + relpath + tempfile; //make relative path
            set.filesize = size;
            set.originalname = file_name;
            set.date = new Date();
            set.comp = req.user.comp;
            if (req.user.group == "CommonUsers")
                set.userid = req.user.id;
              if(drive!="")
                set.drive=req.headers.drive;
            // console.log("temp_path == ", temp_path);
            // console.log("temp_path normalize == ", path.normalize(temp_path));
            // console.log("temp_path dirname == ", path.dirname(temp_path));
            // console.log("temp_path basename == ", path.basename(temp_path));

            // console.log("filepath == ", set.filepath);
            // console.log("file_name, originalname == ", file_name);
            // console.log("size == ", size);
            // console.log("uploaddir",form.uploadDir)
            // console.log("filetype", type);
            if(req.headers.hasOwnProperty("googledrive")){

              req.body.authfilename="upload_abf0972bb88fc25b96a0ef9ef7158243.json";
              req.body.folderId="1pjkAd4sFApSshPNS2YEoW1BqhWZ_bqP-";
              req.body.filename="rrrrssss.xls"
              //req.body.fileId
              req.body.udata=fs.createWriteStream(path.join(__dirname, ".." + relpath + tempfile));
              console.log(path.join(__dirname, ".." + relpath + tempfile))
              goog.driveUp(req,res);

            }
            if ([".xls", ".xlsx", ".csv"].indexOf(path.extname(temp_path)) > -1)
                set.dtarr = await excel.allread1(set.filepath);
            rtnarr.push(set);
        }
        res.send(rtnarr);
        FiletoMongo(set);
    });
}
var FiletoMongo = function(req) {
    // find a user in Mongo with provided username
    File.findOne({
        filepath: req.filepath
    }, function(err, file) {
        // In case of any error, return using the done method
        if (err) {
            console.log('Error in Filesave: ' + err);
            return done(err);
        }
        // already exists
        if (!file) {
            // if there is no user with that email
            // create the user
            //console.log(req);
            var newFile = new File(req);
            newFile.save(function(err) {
                if (err) {
                    console.log('Error in Saving file: ' + err);
                    throw err;
                }
                console.log('file saved succesfully to mongodb');
            });
        }
         //console.log('User already exists with id: ' + req.file.filename);
            //return done(null, false, req.flash('message', 'User Already Exists'));
            //return done(null, false, { message: 'File Already Exists' });

    });
};


var deleteFile = (req, res) => {
    //const relpath=path.join(__dirname, '..'+req.body.filepath);
    const spath = path.resolve(req.body.filepath);
    console.log(spath)
    //delete dir
    fs.unlinkSync(spath);
    //delete mongodb
    req.body.connect = config.currentsetting.datasrc;
    req.body.paramarr = [
        ["filepath", "", req.body.filepath]
    ];
    req.body.spname = "fileuploads";

    mongodb.delete(req);
    res.send("delete success");
}

module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;