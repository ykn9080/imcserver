var dbCallback = function(collect, res) {
    //aft db query, callbacking...
    res.send(collect);
}


var userfilter=(sign,user)=> {
     let fixedStr = ["$comp", "$name", "$id", "$boss", "$division", "$position"];
    let fixedPeriod = ["$thisYear", "$thisQuarter", "$thisMonth", "$thisWeek", "$thisWeednumber", "$Today", "$Yesterday", "$Tomorrow"];
 
   var rtn = sign;
    fixedStr.forEach(function(k,i) {
        var idx = sign.indexOf(k);
        if (idx > -1)
            rtn = rtn.substr(0, idx) + rep(k,user) + rtn.substr(idx + k.length, rtn.length)
    });

    function rep(k,user) {
        var rtn1 = "";
        if (fixedStr.indexOf(k) > -1) {
            var log = user;
            var key = k.substring(1)
            rtn1 = log[key];
       // } else if ($.inArray(k, fixedPeriod) > -1) {
            } else if (fixedPeriod.indexOf(k) > -1) {

            var dd = k.substring(1).replace("this", "").toLowerCase();
            var d = new Date();
            switch (dd) {
                case "year":
                    rtn1 = d.getFullYear();
                    break;
                case "month":
                    rtn1 = d.getMonth();
                    break;
                case "week":
                    var wk = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
                    rtn1 = wk[d.getDay() - 1];
                    break;
                case "weeknumber":
                    rtn1 = d.getDay();
                    break;
                case "today":
                    rtn1 = d.getDate();
                    break;
                case "yesterday":
                    rtn1 = d.addDays(-1);
                    break;
                case "tomorrow":
                    rtn1 = d.addDays(1);
                    break;
            }
        }
        return rtn1;
    }
    return rtn;
}

var mssqlQueryParam = (paramarr, spname,user) => {
    // ["comp", "compcode", "acuvue", "varchar"],
    paramarr.forEach((param) => {
        spname = spname.replace("@" + param[0], "'" + userfilter(param[2],user) + "'")
    });
    return spname;
}
var mssqlProcParam = (request, paramarr,user) => {
    paramarr.forEach((param) => {
        request.input(param[0], paramtype(param[2]), userfilter(param[1],user));
    });
    return request;
}
var mongoParam = (paramarr,user) => {
    var obj={};
    paramarr.forEach((param) => {
        obj[param[0]]=userfilter(param[2],user);
    });
    return obj;
}
var getprocedureparam = (procname) => {
    var qry = "select parameter_id seq, name pname,type_name(user_type_id) dtype,max_length pleng from sys.parameters where object_id =" +
        " object_id('" + procname + "')";
    return qry;
}

var paramtype=(type)=> {
    switch (type) {
        case "varchar":
            return sql.VarChar;
            break;
        case "nvarchar":
            return sql.NVarChar;
            break;
        case "char":
            return sql.Char;
            break;
        case "nchar":
            return sql.NChar;
            break;
        case "text":
            return sql.Text;
            break;
        case "int":
            return sql.Int;
            break;
        case "bigint":
            return sql.BigInt;
            break;
        case "tinyint":
            return sql.TinyInt;
            break;
        case "bit":
            return sql.Bit;
            break;
        case "float":
            return sql.Float;
            break;
        case "decimal":
            return sql.Decimal;
            break;
        case "datetime":
            return sql.DateTime;
            break;
        case "smalldatetime":
            return sql.SmallDateTime;
            break;
    }
}

module.exports.dbCallback = dbCallback;
module.exports.mssqlQueryParam = mssqlQueryParam;
module.exports.mssqlProcParam = mssqlProcParam;
module.exports.mongoParam = mongoParam;
module.exports.getprocedureparam = getprocedureparam;


