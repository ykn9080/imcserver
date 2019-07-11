var filefunc = require('../function/filefunc');
var crudfunc = require('../function/crudfunc');
var dbfunc = require('../function/dbfunc');
var excel = require('../database/excel');
var mssql1 = require('../database/mssql');
var mssql = require('mssql');
var googlespread = require('../api/googlespreadsheet');
var request = require('request');

var portal = require('../publicPortal/queryData1');
const { loadAuth, findAuthDoc } = require("../api/googleapis");

exports.readDataMy = (req, res) => {
    try {
        var p = filefunc.mssqlProcParam(req);

        var spath = filefunc.findpathread(p.path, p.myinfo);
        var dt = crudfunc.readData(spath, p.dataname, p.keycode, p.keyvalue);
        // if (p.path == "data\\json\\imcdata.json" && p.hasOwnProperty("keyvalue") && p.keyvalue != ""){
        //     datanow(dt,res);
        //   }
        //   else
        res.send(dt);
    } catch (err) {
        res.send({ "error": err.name + " " + err.stack });
    }
};
//focus on imcdata retrival, querying & merging datalist
var paramlist = (dt) => {
    let set = {};
    set.connect = dt.connection;
    if (dt.hasOwnProperty("querylist")) {
        dt.querylist.forEach((k, i) => {
            if (k.sqlcommand == "select") {
                set.spname = k.query;
                set.paramarr = k.param;
                set.qtype = k.dtype;
                set.callback = insertdatalist;
                set.dt = dt;
            }
        });
    }
    return set;
}
var makeparam = (url, paramarr) => {
    paramarr.forEach((k, i) => {
        var AND = "&";
        if (i == 0) AND = "?";
        url += AND + k[0] + "=" + k[1];
    });
    return url;
}
var insertdatalist = (datalist, res, opt) => {
    let set = {};

    if (opt.dt.hasOwnProperty("querylist")) {
        opt.dt.querylist.forEach((k, i) => {
            if (k.sqlcommand == "select") {
                k.datalist = datalist;
            }
        });
    }
    res.send(opt.dt);
}
module.exports.insertdatalist = insertdatalist;
var getNodeData = (nodelist, val) => {
    console.log(val)
    if (nodelist != "") {
        nodelist = nodelist.split('.');
        nodelist.forEach(function(k, i) {
            val = val[k];
        });
        if (!Array.isArray(val))
            val = [val];
    }
    return val;
}
async function readDatasrcMy(req, res) {
    try {
        var p = filefunc.mssqlProcParam(req);
        //console.log("req.user: ",req.user,"p: ",p)
        var spath = filefunc.findpathread(p.path, p.myinfo);
        var dt = crudfunc.readData(spath, p.dataname, p.keycode, p.keyvalue);
        var set = paramlist(dt);
        switch (dt.dtype) {
            case "database":
                const input = dt.connectname;
                const cname = input.substr(input.indexOf("[") + 1, input.lastIndexOf("]") - 1);
                set.user = req.user;
                request = { body: set }, response = "";
                switch (cname) {
                    case "mssql":
                        mssql1.mssqlQuery(request, res);
                        break;
                        // case "mysql":
                        //     mongodb.find(request, response);
                        //     break;
                        // case "mongodb":
                        //     mongodb.find(request, response);
                        //     break;
                }
                break;
            case "excel":
                switch (dt.uptype) {
                    case "excel":
                        let rtn = excel.allread1(dt.upload.filepath);
                        dt.datalist = rtn[dt.upload.sheet];
                        res.send(dt);
                        break;
                    case "google":
                        console.log('inside....', req.user.comp, req.user.id, dt.spreadsheetid)
                        googlespread.spreadGet(dt.spreadsheetid, req.user.comp, req.user.id, res, dt);
                        break;
                }
                break;
            case "local":
                var reqq = { body: { url: dt.url } }
                var val = portal.readReturn(dt.url);
                val = getNodeData(dt.findnode, val);
                dt.datalist = val;
                res.send(dt);

                break;
            case "xml":
            case "json":
                request({
                    url: makeparam(dt.url, dt.param),
                    method: 'GET'
                }, function(error, response, val) {
                    val = getNodeData(dt.findnode, JSON.parse(val));
                    dt.datalist = val;
                    res.send(dt);
                });
                break;
        }
    } catch (err) {
        res.send({ "error": err.name + " " + err.stack });
    }
};

async function datanow(dt, res) {
    var b;
    if (dt.hasOwnProperty("querylist")) {
        for (var k of dt.querylist) {
            if (k.sqlcommand == "select" && k.interval == "realtime") {

                k.qtype = k.dtype;
                k.connect = dt.connection;
                k.paramarr = k.param;
                k.spname = k.query;
                k.callback = "";
                b = { body: k };
                const dataset = await dbfunc.mssqlprocess(b);
                res.send("send" + dataset);
            }
        }
    }
    // var await rtn=mssql.connect(b.connect).then(pool => {
    //      var request = new mssql.Request(pool);
    //      switch (b.qtype) {
    //          case "querytable": case "query":
    //              //return request.query(b.spname);
    //              var str=b.spname;
    //              if(b.paramarr.length>0)
    //              str=dbfunc.replaceparam(b.paramarr, str);
    //              console.log('str:',str)
    //              return request.query(str);
    //              break;
    //          case "proctable": case "procedure":
    //              return dbfunc.mssqlProcParam(request, b.paramarr).execute(b.spname);
    //              break;
    //      }
    //  }).then(result => {

    //      return result.recordset;
    //      mssql.close();
    //  }).catch(err => {
    //      console.dir(err);
    //      mssql.close();
    //  });
    //  console.log(rtn);

}

exports.ReadDataSingle = (req, res) => {
    try {
        var p = filefunc.mssqlProcParam(req);
        var dt = crudfunc.readData(p.path, p.dataname, p.keycode, p.keyvalue);
        res.send(dt);
    } catch (err) {
        res.send({ "error": err.name + "\n  " + err.stack });
    }
};
exports.UpdateDataPost = (req, res) => {
    try {
        var p = filefunc.mssqlProcParam(req);

        var dt = crudfunc.updateData(p.path, p.udata, p.dataname, p.keycode, p.keyvalue);
        res.send(dt);
    } catch (err) {
        res.send({ "error": err.name });
    }
};

exports.UpdateDataMy = (req, res) => {
    try {
        var p = filefunc.mssqlProcParam(req);
        var spath = filefunc.findpathread(p.path, p.myinfo);
        crudfunc.updateData(spath, p.udata, p.dataname, p.keycode, p.keyvalue);
        // res.send(dt);

    } catch (err) {
        res.send({ "error123": err.name + " " + err.stack });
    }
};

exports.ReadData = (req, res) => {
    try {
        var p = filefunc.mssqlProcParam(req);
        var dt = crudfunc.readData(p.path, p.dataname, p.keycode, p.keyvalue);
        res.send(dt);
    } catch (err) {
        res.send({ "error": err });
    }
};
exports.ReadDataList = (req, res) => {
    var rtn = filefunc.readDataList(req.body.path, req.body.filetype);
    res.send(rtn);
};

exports.delDataMy = (req, res) => {
    try {
        var p = filefunc.mssqlProcParam(req);

        var spath = filefunc.findpathread(p.path, p.myinfo);
        const dt = crudfunc.deleteData(spath, p.dataname, p.keycode, p.keyvalue);
        res.send(dt);
    } catch (err) {
        res.send({ "error": err.name + " " + err.stack });
    }
};

module.exports.readDatasrcMy = readDatasrcMy;