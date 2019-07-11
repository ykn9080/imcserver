var mssql = require('mssql');
const dbfunc = require('../function/dbfunc');
const dbcommon = require('./dbcommon');

//const DbConnectionString = 'mssql://{user-name}:{password}@{db-server-ip}:{sql-server-port}/{db-name}';
const DbConnectionString = 'mssql://DB_9D66CD_imcmaster_admin:ykn90809080@sql5004.smarterasp.net/DB_9D66CD_imcmaster';

mssql.on('error', err => {
    console.dir(err);
    sql.close();
});
const request = new mssql.Request()

// request.input('nameSuffix', sql.VarChar, 'son')

// const query = `SELECT * FROM [dbo].[Users] WHERE [Name] LIKE '%' + @nameSuffix`

// request.query(query)
//   .then(value => console.log(value))
//   .catch(error => console.log(error))
exports.getparamlist = (req, res) => {
    let b = req.body;
    let c = dbfunc.getprocedureparam(b.spname,req.user);
    req.body.spname = c;
    req.body.paramarr = [];
    req.body.qtype = "querytable";
    mssqlQuery(req, res);
}

var mssqlQuery = (req, res) => {
    let b = req.body;
    let user=req.body.user;
    //let paramvalue = b.paramvalue.split(';');
    //console.log('paramvalue: ', b,mssqlQueryParam(b.paramarr, b.spname))
    //qtype(querytable,proctable),spname,connect,paramarr
    mssql.close();
    mssql.connect(b.connect).then(pool => {
        var request = new mssql.Request(pool);
        switch (b.qtype) {
            case "querytable":
            case "query":
                //return request.query(b.spname);
                var str = b.spname;
                if (b.paramarr.length > 0)
                    str = dbfunc.mssqlQueryParam(b.paramarr, str,user);
                return request.query(str);
                break;
            case "proctable":
            case "procedure":
                return dbfunc.mssqlProcParam(request, b.paramarr,user).execute(b.spname);
                break;
        }
    }).then(result => {
        if (b.hasOwnProperty("callback")) {
            let opt = { db: "mssql"};
            if(b.hasOwnProperty("ctrid"))opt.ctrid= b.ctrid;
            if(b.hasOwnProperty("ctrtype"))opt.ctrtype=  b.ctrtype
            if(b.hasOwnProperty("dt"))opt.dt=  b.dt;
            b.callback(result.recordset, res, opt);
        }else if(res==""){
            return result.recordset;
        }else
            res.send(result.recordset);
        mssql.close();
    }).catch(err => {
        console.dir(err);
        mssql.close();
    });
}

module.exports.mssqlQuery = mssqlQuery;