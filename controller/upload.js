var path = require('path');
var multer = require('multer');
var File = require('../model/allmodel.js');
var fs=require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    	console.log('file:',file,req.filepath,req.body.filepath,req.body)
    	var newDestination='./data/excel/';
        // var newDestination = req.body.filepath;
        // var stat = null;
        // try {
        //     stat = fs.statSync(newDestination);
        // } catch (err) {
        //     fs.mkdirSync(newDestination);
        // }
        // if (stat && !stat.isDirectory()) {
        //     throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        // }       
        cb(null, newDestination);
    },//'./data/excel/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

const uploadsingle = multer({
    storage: storage
    ,limits: { fileSize: 10000000 } //limit 10 MB
    , onFileUploadComplete: function (file, req, res) {
        if (file.error)
            res.send(file.error);
        res.send(file)
    }
}).single('file-to-upload');


var FiletoMongo = function(req) {
    // find a user in Mongo with provided username
    File.findOne({
        filename: req.file.filename
    }, function(err, file) {
        // In case of any error, return using the done method
        if (err) {
            console.log('Error in Filesave: ' + err);
            return done(err);
        }
        // already exists
        if (file) {
            console.log('User already exists with id: ' + req.file.filename);
            //return done(null, false, req.flash('message', 'User Already Exists'));
            return done(null, false, { message: 'File Already Exists' });
        } else {
            // if there is no user with that email
            // create the user
            var newFile = new File({
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                destination: req.file.destination,
                filenam: req.file.filenam,
                path: req.file.path,
                size: req.file.size

            });
            newFile.save(function(err) {
                if (err) {
                    console.log('Error in Saving file: ' + err);
                    throw err;
                }
                console.log('file saved succesfully to mongodb');
            });
        }
    });
};

function uploadFile(req, res) {
	console.log("in......",req.file)
    uploadsingle(req, res, (err) => {
        if (err) {
            res.send(err);
        } else {
             console.log("file:..",req.file);
          
            FiletoMongo(req);
            res.send(req.file);
        }
    });
}




module.exports.uploadFile = uploadFile;