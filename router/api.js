const auth = require('../passport/auth');
module.exports = (app, passport) => {

    const crud = require('../controller/crud');
    const company = require('../controller/company');
    //const upload=require('../controller/upload');
    const upload = require('../controller/upload_formidable');
    const dbcommon = require('../database/dbcommon');
    const mssql = require('../database/mssql');
    const mysql = require('../database/mysql');
    const mongodb = require('../database/mongodb');
    const excel = require('../database/excel');
    const googleapis = require('../api/googleapis.js');
    const googleoauth = require('../api/googleapis_oauth.js');
    const googlespreadsheet = require('../api/googlespreadsheet.js');
    const googlespreadoauth = require('../api/googlespread_oauth.js');
    const publicportal = require('../publicPortal/queryData1');
    /*json api collection*/
    app.post('/ReadDataMy', crud.readDataMy);
    app.post('/ReadDatasrcMy', auth().authenticate(), crud.readDatasrcMy);
    app.post('/ReadDataSingle', crud.ReadDataSingle);
    app.post('/UpdateDataPost', crud.UpdateDataPost);
    app.post('/ReadData', crud.ReadData);
    app.post('/ReadDataList', crud.ReadDataList);
    app.post('/UpdateDataMy', crud.UpdateDataMy);
    app.post('/delDataMy', crud.delDataMy);

    //app.post('/jsonInit', api.jsonInit);
    /*mongodb api collection*/
    app.post('/CompanyAdd', company.create);
    app.get('/CompanyAll', company.findAll);
    app.get('/Company/:id', company.findOne);
    app.put('/Company/update/:id', company.update);
    app.delete('/Company/delete/:id', company.delete);

    //mssql
    //app.post('/mssqlpost', mssql.mssqlpost);
    app.post('/mssql1', mssql.mssqlQuery);
    app.post('/DeriveParam', mssql.getparamlist);
    app.post('/proctable', mssql.mssqlQuery);
    app.post('/querytable', mssql.mssqlQuery);
    app.post('/executeNonQuery', mssql.mssqlQuery);

    //mysql
    app.post('/mysql', mysql.mysqlquery);

    //mongodb
    app.post('/mongocreate', mongodb.create);
    app.post('/mongofindall', mongodb.findAll);
    app.post('/mongofind', mongodb.find);
    //app.post('/mongoupdate', mongodb.update);
    app.post('/mongodel', mongodb.delete);

    //multiple datalist search at once
    app.post('/batchquery', dbcommon.batchQuery);
    //excel read/write
    app.post('/xlsxread', excel.xlsxRead);
    app.post('/allread', excel.allRead);
    app.post('/xlsxAppendSheet', excel.xlsxAppendSheet);
    app.post('/xlsxUpdateSheet', excel.xlsxUpdateSheet);
    app.post('/xlsxchangerow', excel.xlsxChangeRow);

    //fileupload
    app.post('/uploadfile', auth().authenticate(), upload.uploadFile);
    app.post('/deletefile', upload.deleteFile);

    //googleapis
    app.post('/createDir', googleapis.createDir);
    app.post('/driveup', googleapis.driveUp);
    app.post('/drivedown', googleapis.driveDown);

    app.post('/spreadRead', googlespreadsheet.spreadRead);
    app.post('/spreadAppend', auth().authenticate(), googlespreadsheet.spreadAppend);
    app.post('/spreadUpdate', auth().authenticate(), googlespreadsheet.spreadUpdate);
    app.post('/spreadCreate', auth().authenticate(), googlespreadsheet.spreadCreate);


    app.post('/oauthtest', googlespreadoauth.oauthtest);
    app.post('/createFolder', googleoauth.createFolder);

    //public portal
    app.post('/portalget', publicportal.portalGet);
    app.post('/readlocal', publicportal.readLocal);

    var file = {
        "results": [{
                "id": "1",
                "name": "Book",
                "price": "18",
                "quality": "A",
                "done": true,
                "date": "2020-01-01",
                "desc": "this is true"
            },
            {
                "id": "2",
                "name": "Mobile",
                "price": "400",
                "quality": "B",
                "done": false,
                "date": "2020-02-01",
                "desc": "this is false"
            },
            {
                "id": "3",
                "name": "PC",
                "price": "1000"
            },
            {
                "id": "4",
                "name": "PS4",
                "price": "500"
            },
            {
                "id": "5",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "6",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "7",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "8",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "9",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "10",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "11",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "12",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "13",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "14",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "15",
                "name": "Chromebook",
                "price": "500"
            },
            {
                "id": "16",
                "name": "Chromebook",
                "price": "500"
            }
        ]
    };

    app.get("/results", function(req, res) {
        res.send(file);
    });



};