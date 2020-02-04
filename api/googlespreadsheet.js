const { google } = require("googleapis");
var path = require("path");
var fs = require("fs");
var drive = google.drive("v3");
var async = require("async");
var jwtClient;
const { loadAuth, findAuthDoc } = require("./googleapis");
var sheets = google.sheets("v4");

//Google Sheets API

var arrToObj = arr => {
  //convert arr=[['a','b'],[1,2]] to arrobj=[{a:1,b:2}]
  let newarr = [],
    set;
  let head = arr[0];
  for (var i = 1; i < arr.length; i++) {
    set = {};
    head.forEach((k, j) => {
      set[k] = arr[i][j];
    });
    newarr.push(set);
  }
  return newarr;
};
var objToArr = obj => {
  //convert arrobj=[{a:1,b:2}] to arr=[['a','b'],[1,2]]
  let newarr = [];
  newarr.push(Object.keys(obj[0]));
  obj.forEach((k, j) => {
    newarr.push(Object.values(k));
  });
  return newarr;
};
async function spreadRead(req, res) {
  let b = req.body;
  console.log(b, "bbbb:", b.spreadsheetId);
  let range = "A1:ZZ100000",
    spreadsheetId; // = '16gzRw9EO8z4P-goPesrgQajsPMV1XDHUq2kPauzK5QM';
  let authdt = await findAuthDoc(b.comp, b.id, "googledrive");
  let authset = {
    doc: "." + authdt[0].filepath
  };
  jwtClient = loadAuth(authset);
  if (b.hasOwnProperty("range")) range = b.range;
  if (b.hasOwnProperty("spreadsheetId")) spreadsheetId = b.spreadsheetId;
  console.log(authset, spreadsheetId);
  sheets.spreadsheets.values.get(
    {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: range
    },
    function(err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
      } else {
        let objectStyle = arrToObj(response.data.values);
        console.log(objectStyle);
        res.send(objectStyle);
      }
    }
  );
}
/*
    return to client dataset
    add datalist to dt
    google spreadsheet

*/
exports.spreadGet = async (spreadsheetId, comp, userid, res, dt) => {
  let range = "A1:ZZ100000";
  let authdt = await findAuthDoc(comp, userid, "googledrive");
  let authset = {
    doc: "." + authdt[0].filepath
  };
  jwtClient = loadAuth(authset);
  sheets.spreadsheets.values.get(
    {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: range
    },
    function(err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
      }
      //console.log(response.data.values);
      dt.datalist = arrToObj(response.data.values);
      res.send(dt);
    }
  );
};

function spreadAppend(req, res) {
  let authfilename,
    range = "A1:ZZ100000",
    spreadsheetId = "16gzRw9EO8z4P-goPesrgQajsPMV1XDHUq2kPauzK5QM";
  let b = req.body;
  let authset = {
    doc: "../data/storage/" + b.authfilename
  };
  jwtClient = loadAuth(authset);
  let values = [
    [
      // Cell values ...
      8,
      7,
      7
    ]
    // Additional rows ...
  ];
  const resource = {
    values
  };
  range = "A5:C5";
  sheets.spreadsheets.values.append(
    {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: "My Report1",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",

      // range: range,
      // valueInputOption: "USER_ENTERED",
      resource: resource
    },
    (err, result) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        console.log("%d cells updated.", result.updatedCells);
      }
    }
  );
}

function spreadUpdate(req, res) {
  loadAuth();
  let values = [
    ["go", "to", "uss"],
    [1, 4, 7],
    [1, 4, 7],
    [1, 4, 7]

    // Additional rows ...
  ];
  const resource = {
    values
  };
  let range = "My Report1!A1";
  sheets.spreadsheets.values.update(
    {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: resource
    },
    (err, result) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        console.log("%d cells updated.", result.updatedCells);
      }
    }
  );
}

function spreadCreate(req, res) {
  loadAuth();
  sheets.spreadsheets.create(
    {
      auth: jwtClient,
      resource: {
        properties: {
          title: "spreadtest"
        }
      }
    },
    (err, response) => {
      if (err) {
        console.log("The API returned an error: " + err);
        return;
      } else {
        console.log(response, "Added");
        res.send(response);
      }
    }
  );
}

module.exports.spreadRead = spreadRead;
module.exports.spreadAppend = spreadAppend;
module.exports.spreadUpdate = spreadUpdate;
module.exports.spreadCreate = spreadCreate;
