const {google} = require('googleapis');
var fs = require('fs');
const readline = require('readline');

let oauthkey = require("./credentials.json");
const CLIENT_ID = oauthkey.web.client_id; //'7685xxxxxx-sxxxxxxxxxxxxxxxxxxxxxxxxxxxxxm.apps.googleusercontent.com';
const CLIENT_SECRET = oauthkey.web.client_secret; //'ixxxxxxxxxxxxxxx4Z';
const REDIRECT_URL = oauthkey.web.redirect_uris[0];//'http://localhost:3001/api';
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URL
);
var drive = google.drive({ version: 'v3', auth: oauth2Client });

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.scripts',
    'https://www.googleapis.com/auth/calendar'
];

function createFolder(res,req){
// Load client secrets from a local file.
fs.readFile('./api/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});
}
module.exports.createFolder=createFolder;
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  // const {client_secret, client_id, redirect_uris} = credentials.web;
  // const oAuth2Client = new google.auth.OAuth2(
  //     client_id, client_secret, redirect_uris[0]);
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URL
);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// *
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
 
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });




  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}





/*
var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
});
//console.log(url); //this is the url which will authenticate user and redirect to your local server. copy this and paste into browser
module.exports = (app) => {

  var executeQuery1 = function(res, query) {


module.exports.createFolder = function () {
  var getTokens = function(code) {
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if(!err) {
        console.log("tokens: ",tokens);
        //refresh_token
        oauth2Client.setCredentials(tokens);
        async.auto({
          userFolder : function(next,result) {
            return createFolder('test123',null,next);
          }
        },function(err,result){
          if(!err){
            console.log("result: ",result);
          }else{
            console.log("error: ",err);
          }
        });
      }else {
        console.log("error: ",err);
      }
    });
  };
 
 
//creating the folder in drive
  function createFolder(name,folderId,next) {
    var folderIds=[];
    if(folderId !== null){
      folderIds.push(folderId);
    }
    var fileMetadata = {
      'name' : name,
      'mimeType' : 'application/vnd.google-apps.folder',
       parents: folderIds
    };
    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function(err, file) {
      if(err) {
        console.log("error creating folder: ",err);
        next(err);
      } else {
        console.log('Folder Id: ', file.id);
        next(err,file.id);
      }
    });
  }
  return {
    getTokens:getTokens
  };
}
*/


