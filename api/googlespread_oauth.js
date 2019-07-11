let google = require('googleapis');
let authentication = require("./authentication");
//const {Authentication} =require( './authentication');

function getData(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '16gzRw9EO8z4P-goPesrgQajsPMV1XDHUq2kPauzK5QM',
    range: 'A1:ZZ100000', //Change Sheet1 if your worksheet's name is something else
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } 
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        console.log(row.join(", "));
      }
    }
  });
}
module.exports.oauthtest=(rep,res)=>{
var auth=new authentication();
auth.authenticate().then((auth)=>{
    getData(auth);
});
}
