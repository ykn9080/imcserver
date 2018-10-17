var sql = require("mssql");
var config = require("../config").config.mssql.smarterasp;
const pool = new sql.ConnectionPool(config);
var path = require("path");
var fs = require("fs");
  var func = require("../function/api");
pool.connect();

module.exports = (app) => {

  var executeQuery1 = function(res, query) {

    var req = new sql.Request(pool);
    req.query(query).then(function(recordset) {
      console.log(recordset);
      sql.close();
    }).catch(function(err) {
      console.log(err);
      sql.close();
    });

  }

  var executeQuery2 = function(res, query) {
    var request = new sql.Request(pool);
    request.query(query).then(result => {
      let rows = result.recordset
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json(rows);
      sql.close();
    }).catch(err => {
      res.status(500).send({message: "${err}"})
      sql.close();
    });
  }

  var executeQuery3 = function(res, query) {
    // create Request object
    var request = new sql.Request(pool);
    // query to the database
    request.query(query, function(err, recordset) {
      if (err) {
        console.log("Error while querying database :- " + err);
        res.send(err);
      } else {
        res.json(recordset);
      }
    });
    sql.close();
  }
  var executeQuery4 = function(res, query) {
    new sql.ConnectionPool(config.mssql.smarterasp).connect().then(pool => {
      return pool.request().query(qstr)
    }).then(result => {
      let rows = result.recordset
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json(rows);
      sql.close();
    }).catch(err => {
      res.status(500).send({message: "${err}"})
      sql.close();
    });
  }

  /* GET ALL PRODUCTS */
  app.get('/mssql', function(req, res) {
    // render the page and pass in any flash data if it exists
    var qstr = 'select * from comp';
    executeQuery2(res, qstr);
  });

  //GET API
  app.get("/api/user", function(req, res) {
    var val = "'1','acuvue'";
    var qstr = `select * from comp where compcode in (${val})`; //`'$
    executeQuery1(res, qstr);
  });
  app.get("/api/user/:id", function(req, res) {
    var val = req.params.id;

    //var val = "'1','acuvue'";
    var qstr = `select * from comp where compcode = '${val}'`; //`'$
    executeQuery3(res, qstr);
  });

  //PUT API
  app.put("/api/:table/:id", function(req, res) {
    console.log(req.body)
    var query = "UPDATE " + req.params.table + " SET compname='" + req.body.name + "'  WHERE compcode= '" + req.params.id + "'";
    executeQuery3(res, query);
  });

  // DELETE API
  app.delete("/api/:qstr", function(req, res) {
    var qstr = JSON.parse(req.params.qstr);
    console.log(qstr)
    var query = "DELETE FROM " + req.params.table + " WHERE compcode='" + req.params.id + "'";
    executeQuery3(res, query);
  });

  app.get('/mssql/test', function(req, res) {

    sql.connect(config.mssql.smarterasp, function(err) {
      if (err)
        console.log(err);
      var request = new sql.Request();
      var val = "'1','acuvue'";
      var qstr = `select * from comp where compcode in (${val})`; //`'${val}'`;
      request.query(qstr, function(err, recordset) {
        if (err)
          console.log(err)
        res.send(recordset.recordsets[0]);
      });
    });
  });
  app.get('/json/:dir/:name', function(req, res) {
    // console.log("findpath:......", func.Login("ykn"));
    // const pth = path.join(__dirname, '../data/', req.params.name + ".json");
      var pathNfile=func.makedirfile(req.params.dir,req.params.name)
      console.log(pathNfile)
    var readme = fs.readFileSync(pathNfile, 'utf8');
    res.send(readme);
  });

  app.post('/json/:dir/:name', function(req, res) {
    // dir: dir1+dir2, name: imctable.json
    var pathNfile=makedirfile(req.params.dir,req.params.name)
    //var pathNfile=func.makedirfile('data/json2',"goodboy.js")

     func.makeDirectory(pathNfile);
    // var ppth = req.params.dir,
    //   pthNfile;
    // ppth = ppth.split('+').join('/');
    // pthNfile = path.join(__dirname, '../', ppth, req.params.name + ".json");


    var content="hi";
    content=JSON.stringify(req.body);
    var rtn=func.writeFile(pathNfile, content);

    res.send(rtn);
  });

}
