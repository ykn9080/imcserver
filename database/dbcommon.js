const dbfunc=require('../function/dbfunc');
const mssql = require('./mssql'); 
const mysql=require('./mysql');
const mongodb=require('./mongodb');
const excel=require('./excel');

global.rtnarray=[];
exports.batchQuery = (req, res) => { 
    const dbarray=req.body;
    global.rtnarray=[];
    dbarray.forEach((dt,i,arr)=>{
    	console.log("it's dt!!!:",dt,"it's i:",i,"it's array:",arr)
    	dt.paramlist.callback=batchCallback;
    	dt.paramlist.ctrid=dt.ctrid;
    	dt.paramlist.ctrtype=dt.ctrtype;
    	dt.paramlist.db=dt.db;
       
    	request={body:dt.paramlist}, response="";
    	if (Object.is(arr.length - 1, i)) response=res;//only last one response, others just blank
    	switch(dt.router){
    		case "querytable":case "proctable": case "executeNonQuery": case "mssql1":
    		mssql.mssqlQuery(request,response);
    		break;
    		case "mongofind":
    		mongodb.find(request,response);
    		break;
            case "allread":
            const dtt=excel.allread1(dt.paramlist.filepath);
            batchCallback(dtt[dt.paramlist.sheet],res,dt.paramlist);
            break;
    	}
    });
};
global.batchCallback=(collect,res,opt)=>{
	global.rtnarray.push({ctrid:opt.ctrid, ctrtype:opt.ctrtype,db:opt.db, datalist:collect});
	if(res!=""){
		res.send(global.rtnarray);
		global.rtnarray=[];
	}
}
//module.exports.batchCallback=batchCallback;