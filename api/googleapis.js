const { google } = require('googleapis');
var path = require('path');
var fs = require('fs');
var drive = google.drive("v3");
var async = require('async');
var File = require('../model/allmodel.js');
var jwtClient;

function loadAuth(authset) {
    if(typeof authset=="undefined")
    authset = {
        doc:"../data/storage/upload_abf0972bb88fc25b96a0ef9ef7158243.json",
    }
    let privatekey = require(authset.doc); //require("./google_oauth.json");
    // configure a JWT auth client
    jwtClient = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key,
        ['https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.appdata',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata',
            'https://www.googleapis.com/auth/drive.scripts',
            'https://www.googleapis.com/auth/calendar'
        ],
        null
    );
    //authenticate request
    jwtClient.authorize(function(err, tokens) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Successfully connected!");
        }
    });
    return jwtClient;
}
module.exports.loadAuth = loadAuth;
module.exports.findAuthDoc = findAuthDoc;
module.exports.createDir = createDir;
module.exports.driveUp = driveUp;
module.exports.driveDown = driveDown;

async function findAuthDoc(comp,userid,drive){
     let rtnpath=await File.find({
        comp: comp,
        drive:drive
    }, function(err, file) {
        if (err) {
            console.log('Error in Filesave: ' + err);
            return done(err);
        }
    });
     return rtnpath;
}
function createDir(req, res) {
    loadAuth();
    var permissions = [{
            'type': 'user',
            'role': 'writer',
            'emailAddress': 'youngkinam@gmail.com'
        }
        // , {
        //   'type': 'domain',
        //   'role': 'writer',
        //   'domain': 'localhost:3001'
        // }
    ];
    var fileMetadata = {
        'name': 'Invoices',
        'permissions': permissions,
        'mimeType': 'application/vnd.google-apps.folder'
    };


    drive.files.create({
        auth: jwtClient,
        resource: fileMetadata,
        fields: 'id'
    }, function(err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('Folder Id: ', file.data.id);
        }
    });
}

function driveUpdate(udata, fileId,res) {
    //loadAuth();
    //const readStream = fs.createReadStream(path.join(__dirname, '../data/json/imccss.json'))
    drive.files.update({
        auth: jwtClient,
        uploadType: 'media',
        fileId: fileId, //'1e9R3Fx-CJiaKv--lWQxPkEPabTzy2Tce',
        media: {
            mimeType: 'application/json',
            body: udata //readStream
        }
    }, function(err, data) {
        if (err) {
            console.error(err);
        }
        if(typeof res!="undefined")
        res.send("successfully updated !!")
        //console.log(data);

    });
}

function driveInsert(udata, folderId, filename, res) {
    loadAuth();
    //var folderId = '1pjkAd4sFApSshPNS2YEoW1BqhWZ_bqP-';

    var fileMetadata = {
        'name': filename,
        parents: [folderId],
        //'mimeType': 'application/json'
        'mimeType':"application/vnd.ms-excel"
    };
    var media = {
        mimeType: "application/vnd.ms-excel",
        //mimeType: "application/json",
        body: udata //fs.createReadStream(path.join(__dirname, '../data/json/imccss.json'))
    };
    drive.files.create({
        auth: jwtClient,
        resource: fileMetadata,
        media: media,
        fileds: 'id'
    }, function(err, file) {
        if (err) console.error("errrr:" + err);
        //console.log('File id:', file.data.id);
        res.send("Successfully Inserted!!!")
    });
}

function driveUp(req, res) {
    /*
        name: upload to googledrive 
        desc: if new, create, else update
        parameter:authfilename,folderId,filename,fileId,udata
        data: 2019.2.25
    */
    console.log("imin driveup")
    let authfilename, folderId, fileId, filenames, udata;
    const dir = "../data/storage/";
    let authset = {
        doc: dir + req.body.authfilename
    }
    loadAuth(authset);
    folderId = req.body.folderId; //'1pjkAd4sFApSshPNS2YEoW1BqhWZ_bqP-';
    filename = req.body.filename; //only single string 
    udata = req.body.udata;

    if (req.body.hasOwnProperty("fileId"))
        fileId = req.body.fileId;
    let opt = { auth: jwtClient };
    opt.q = "name='" + filename + "' and trashed = false";

    var tasks = [
        function(callback) {
            drive.files.list(opt, function(err, list) {
                if (err) return callback(err);
                //if (list.length == 0) return callback('No Result Error');
                callback(null, list);
            })
        }
    ];
    async.waterfall(tasks, function(err, list) {
        if (err)
            console.log('err');
        //console.log("result: ",list)

        if (list.data.files.length > 1) {
            list.data.files.forEach((k, i) => {
                fileId = list.data.files[i].id;
                if(i==list.data.files.length-1)
                driveUpdate(udata, fileId,res);
                else
                    driveUpdate(udata, fileId);
            });
        }
        else{
              console.log('imin insert')
            driveInsert(udata, folderId, filename, res);
        }
    });
}

function driveDown(req, res) {
    /*
        name: download from googledrive to client or writestream
        desc: using async.map, loop multiple files and combine one json file
        parameter:
            1. authfilename:google auth document(saved in /data/storage/)
            2. folderId: googledrive folder
            3. filenames: array of filename that search for
            4. savetype: send:respond to client, writestream: write to /data/json2/ 
        date:2019.2.25
    */
    let authfilename, folderId, fileId, filenames, savetype;
    const dir = "../data/storage/";
    let authset = {
        doc: dir + req.body.authfilename
    }
    loadAuth(authset);
    folderId = req.body.folderId; //'1pjkAd4sFApSshPNS2YEoW1BqhWZ_bqP-';
    filenames = req.body.filenames; //check object, if not single file
    savetype = req.body.savetype; //res.send() or save file to directory
    if (req.body.hasOwnProperty("fileId"))
        fileId = req.body.fileId;
    let opt = { auth: jwtClient };

    //if (typeof name != "undefined" && typeof name == "string")
    //   opt.q = "name contains " + "imcregister";

    drive.files.list(opt, function(err, list) {
        if (err) return callback(err);
        if (list.length == 0) return callback('No Result Error');
        var newlist = [];
        list.data.files.forEach((item) => {
            filenames.forEach((file) => {
                if (item.name === file)
                    newlist.push(item);
            });
        })
        async.map(newlist, function(file, callback) {
            drive.files.get({
                auth: jwtClient,
                alt: 'media',
                fileId: file.id
            }, function(err, dt) {
                if (err) return callback(err);

                callback(null, dt.data);
            })
        }, function(err, dt) {
            // results is an array of names
            console.log(filenames);
            var newset = {};
            filenames.forEach((name, i) => {
                newset[name] = dt[i];
            })
            switch (savetype) {
                case "send":
                    res.send(newset);
                    break;
                case "writestream":
                    filenames.forEach((name, i) => {
                        var dest = fs.createWriteStream(path.join(__dirname, "../data/json2/" + name));
                        dest.write(JSON.stringify(dt[i]));
                    });
                    break;
            }

        });
    });

    /*
    //sample snippet for async.waterfall
    //*****************************************
        var tasks = [
            function(callback) {
                drive.files.list(opt, function(err, list) {
                    if (err) return callback(err);
                    if (list.length == 0) return callback('No Result Error');
                    callback(null, list);
                })
            },
             function (list, callback) {
                 console.log("result: ",list.data.files[0].id)
                 drive.files.get({auth: jwtClient,alt:'media',fileId: list.data.files[0].id}
                 , function (err,data) {
                    if (err) return callback(err);
                    console.log("filefound: ",data)
                    callback(null,data);
                });
            }
        ];

        async.waterfall(tasks, function(err, result) {
            if (err)
                console.log('err');
            res.send(result);
        });
        //************************************************************
    */

}








// const config=require('../config/index');
// const readline = require('readline');
// const google = require('googleapis');
// const OAuth2Client = google.auth.OAuth2;
// //const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// const SCOPES = ['https://www.googleapis.com/auth/drive'];
// const TOKEN_PATH = 'credentials.json';


// var gclient = require("googleapis"),
//     //YOU must create this file to return the appropriate object or update the gconfig values below to hardcode (not recommended for security).
//     gconfig = {
//         CLIENT_ID: '33750826770-1amj3qrrn7k31cd01o8m145inmlopu7p.apps.googleusercontent.com',
//         SERVICE_EMAIL: 'youngkinam@gmail.com', //
//         JSON_FILE_PATH: './googleapis.json' //Key file provided from setup above
//     },
//     jwtClient = new gclient.auth.JWT(
//         gconfig.CLIENT_ID,
//         gconfig.JSON_FILE_PATH,
//         null, ['https://www.googleapis.com/auth/drive',
//             // 'https://www.googleapis.com/auth/drive.appdata',
//             // 'https://www.googleapis.com/auth/drive.apps.readonly',
//             // 'https://www.googleapis.com/auth/drive.file',
//             // 'https://www.googleapis.com/auth/drive.metadata',
//             // 'https://www.googleapis.com/auth/drive.metadata.readonly',
//             // 'https://www.googleapis.com/auth/drive.readonly',
//             // 'https://www.googleapis.com/auth/drive.scripts',
//             'https://www.googleapis.com/auth/admin.reports.audit.readonly'
//         ],
//         gconfig.SERVICE_EMAIL
//     ); // I think for an insert, this doesn't actually control the owner but it's required and I'm fuzzy on the purpose

// function insertTest(drive) { //Need to figure out how to specify owner because the service accont owns this file right now which isn't very useful
//     drive.files.insert({
//             resource: {
//                 title: 'I was created by Node.js!',
//                 mimeType: 'text/plain'
//             },
//             media: {
//                 mimeType: 'text/plain',
//                 body: 'Ipsum Lorem!'
//             }
//         },
//         function(err, resp) {
//             if (err) {
//                 console.log('insert error: ', err);
//             } else {
//                 console.log('File created. See id following:');
//                 console.dir(resp);
//             }
//         }
//     );
// }
// module.exports.insertTest=insertTest;

// jwtClient.authorize(function(err, tokens) {
//     if (err) {
//         console.log("Error authorizing with JWT", err);
//         return;
//     }

//     var drive = gclient.drive({
//         version: 'v2',
//         auth: jwtClient
//     });

//     insertTest(drive);
// });


// // Load client secrets from a local file.
// fs.readFile(config.oauth.googleapis, (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Google Drive API.
//     authorize(JSON.parse(content), listFiles);
//      authorize(JSON.parse(content), getFile);
//      authorize(JSON.parse(content), insertFileInFolder);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//     const {client_secret, client_id, redirect_uris} = credentials.installed;
//     const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//         if (err) return getAccessToken(oAuth2Client, callback);
//         oAuth2Client.setCredentials(JSON.parse(token));
//         callback(oAuth2Client);
//     });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//         rl.close();
//         oAuth2Client.getToken(code, (err, token) => {
//             if (err) return callback(err);
//             oAuth2Client.setCredentials(token);
//             // Store the token to disk for later program executions
//             fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//                 if (err) console.error(err);
//                 console.log('Token stored to', TOKEN_PATH);
//             });
//             callback(oAuth2Client);
//         });
//     });
// }

// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listFiles(auth) {
//     const drive = google.drive({version: 'v3', auth});
//     drive.files.list({
//         pageSize: 10,
//         fields: 'nextPageToken, files(id, name)',
//         q: "('1iYkPNzZc7DNasdfasdfasdfasdfasd' in parents) and (mimeType='image/jpeg') and (trashed=false)",
//         spaces: 'drive',
//     }, (err, {data}) => {
//         if (err) return console.log('The API returned an error: ' + err);
//         const files = data.files;
//         if (files.length) {
//             console.log('Files:');
//             files.map((file) => {
//                 console.log(file);
//                 //console.log(`${file.name} (${file.id})`);
//             });
//         } else {
//             console.log('No files found.');
//         }
//     });
// }

// function getFile(auth) {
//     const drive = google.drive({version: 'v3', auth});
//     drive.files.get({
//         'fileId': '1Bt4HwM8hpSZpdvasdfasdfasdfasdf',
//     }, (err, {data}) => {
//         if (err) return console.log('The API returned an error: ' + err);
//         if (data) {
//             console.log(`Name: ${data.name} (ID: ${data.id}) - ${data.mimeType}`);
//         }
//     });
// }

// function insertFileInFolder(auth){

//     var data = {   
//         name: 'My Report',                                
//         minmeType: 'application/vnd.google-apps.spreadsheet',  
//         fileType: 'text/csv',                                  
//         body: 'files/report.csv'                               
//     };
//     // var data = {   
//     //     name: 'hoian.jpg',
//     //     minmeType: '',
//     //     fileType: 'image/jpeg',
//     //     body: 'files/hoian.jpg'
//     // };

//     const drive = google.drive({version: 'v3', auth});
//     var folderId = '1iYkPNzZc7DNasdfasdfasdfasdfasd';  

//     var fileMetadata = {
//         parents: [folderId],
//         'name': data.name,
//         'mimeType':data.mimeType,
//     };
//     var media = {
//         mimeType: data.fileType,
//         body: fs.createReadStream(data.body)
//     };
//     drive.files.create({
//         resource: fileMetadata,
//         media: media,
//         fields: 'id'
//     }, function (err, file) {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log('File Id: ', file.data.id);
//         }
//     });
// }