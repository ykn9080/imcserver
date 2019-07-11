const mysql = require('mysql');
var dbfunc = require('../function/dbfunc');


function initmysql(connectstr) {
    const con = mysql.createConnection(connectstr);
    con.connect((err) => {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        console.log('Connection established');
    });

    // con.end((err) => {
    //     // The connection is terminated gracefully
    //     // Ensures all previously enqueued queries are still
    //     // before sending a COM_QUIT packet to the MySQL server.
    // });

    return con;
}

exports.mysqlquery = (req, res) => {
    const b = req.body;
    // console.log(b);
    // console.log(JSON.parse(b.connect));
    const con = initmysql(JSON.parse(b.connect));

    var str = b.spname;
    if (b.paramarr.length > 0)
        str = dbfunc.mssqlQueryParam(b.paramarr, str);
    console.log('str:', str)


    con.query(str, (err, rows) => {
        if (err) throw err;
        con.end((err) => {
            // The connection is terminated gracefully
            // Ensures all previously enqueued queries are still
            // before sending a COM_QUIT packet to the MySQL server.
        });
        console.log('Data received from Db:\n');
        res.send(rows);
    });
};