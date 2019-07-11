var XLSX = require('xlsx');
const fs = require('fs');
var dbfunc = require('../function/dbfunc');

var overwrite_workbook = (filepath, workbook) => {
    // fs.unlinkSync(filepath); //"./data/excel/test-write.xlsx"
    const content = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    fs.writeFileSync(filepath, content, { encoding: 'binary' });
}
var funcRead = (workbook, worksheet) => {

    var sheet_name_list = workbook.SheetNames;
    //sheet_name_list.forEach(function(y) {
    var headers = {};
    var data = [];
    for (z in worksheet) {
        if (z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0, tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }
        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;

    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    return data;
}
var allread1 = (filepath) => {
    var obj = {},
        data;
    const workbook = XLSX.readFile(filepath);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(sheetname) {
        obj[sheetname] = funcRead(workbook, workbook.Sheets[sheetname]);
    });
//    console.log("obj....", obj);
    return obj;
}
var allRead = (req, res) => {
    //     var arr=[],data;
    //      const workbook = XLSX.readFile(req.body.filepath);
    //      var sheet_name_list = workbook.SheetNames;
    //      sheet_name_list.forEach(function(y){
    // arr.push({"sheet":y, "dt":funcRead(workbook,workbook.Sheets[y])});
    //      });
    const rtn = allread1(req.body.filepath);
     if (!req.body.hasOwnProperty("callback"))
        dbfunc.dbCallback(rtn,res);
    else
     req.body.callback(rtn, res);
    //res.send(rtn);

}

function xlsxRead(req, res) {
    var data = [];

    const workbook = XLSX.readFile(req.body.filepath);
    if (req.body.hasOwnProperty("sheetname")) {
        const worksheet = workbook.Sheets[req.body.sheetname];

        data = funcRead(workbook, worksheet);
    } else {
        // workbook.SheetNames.forEach(function(y) {
        //    data.push({sheetname:y, data:funcRead(workbook,y)});
        // });
        data = allread1(req.body.filepath)
    }

    res.send(data);
}

function xlsxAppendSheet(req, res) {
    const b = req.body; //filepath,sheetname,sheetdata
    var workbook = XLSX.readFile(b.filepath);
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(b.sheetdata), b.sheetname);
    overwrite_workbook(b.filepath, workbook);
}

function xlsxUpdateSheet(req, res) {
    //update entire sheet
    const b = req.body; //filepath,sheetname,sheetdata
    var data = [
        { "name": "John", "city": "Seattle" },
        { "name": "Mike", "city": "Los Angeles" },
        { "name": "Zach", "city": "New York" }
    ];
    const read_sheet = (workbook) => {
        var sheet_name_list = workbook.SheetNames;
        var arr = [];
        sheet_name_list.forEach(function(sheetname) {
            let sheet = workbook.Sheets[sheetname];
            arr.push({ sheet: sheet, sheetname: sheetname });
        });
        return arr;
    }
    var workbook = XLSX.readFile(b.filepath);
    var sheetlist = read_sheet(workbook);
    console.log(sheetlist)
    workbook = XLSX.utils.book_new();
    sheetlist.forEach(obj => {
        console.log(obj)
        if (obj.sheetname != b.sheetname)
            XLSX.utils.book_append_sheet(workbook, obj.sheet, obj.sheetname);
        else
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(b.sheetdata), b.sheetname);
    });
    //XLSX.utils.book_append_sheet(workbook, ws, "People");
    overwrite_workbook(b.filepath, workbook);
}

function xlsxChangeRow(req, res) {
    //insert,update,delete single row in a worksheet
    const b = req.body; //filepath,keycode,keyvalue,rowvalue,sheetname,sqlcommand(update,insert,delete)
    const ec = (r, c) => {
        return XLSX.utils.encode_cell({ r: r, c: c })
    }
    const delete_row = (ws, row_index) => {
        let range = XLSX.utils.decode_range(ws["!ref"])
        for (var R = row_index; R <= range.e.r; ++R) {
            for (var C = range.s.c; C <= range.e.c; ++C) {
                ws[ec(R, C)] = ws[ec(R + 1, C)]
            }
        }
        range.e.r--
        ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
    }
    var keycolIndex;
    var workbook = XLSX.readFile(b.filepath);
    //var sheet = workbook.Sheets[workbook.SheetNames[0]];
    var sheet = workbook.Sheets[b.sheetname];
    var range = XLSX.utils.decode_range(sheet['!ref']); //range={ s: { c: 0, r: 0 }, e: { c: 1, r: 4 } }
    var head = [],
        orderedrow = [];
    for (var C = range.s.c; C <= range.e.c; ++C) {
        let headcell = sheet[XLSX.utils.encode_cell({ r: 0, c: C })].v;
        head.push(headcell);
        if (b.hasOwnProperty("rowvalue"))
            orderedrow.push(b.rowvalue[headcell]);
        if (headcell == b.keycode);
        keycolIndex = C - 1;
    }
    var rowIndex = -1; //insert into last row that is not existing now. 0:headrow, 1:first row etc....
    for (var R = range.s.r; R <= range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
            if (C == keycolIndex && cell.v == b.keyvalue) {
                //sheet[XLSX.utils.encode_cell({ r: 1 /* 2 */ , c: 2 /* C */ })] = { t: 's' /* type: string */ , v: 'abc123' /* value */ };
                rowIndex = R;
            }
        }
    }
    switch (b.sqlcommand) {
        case "update":
        case "insert":
            XLSX.utils.sheet_add_aoa(sheet, [orderedrow], { origin: rowIndex });
            break;
        case "delete":
            console.log(rowIndex)
            delete_row(sheet, rowIndex);
            break;
    }
    overwrite_workbook(b.filepath, workbook);
    // const content = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    // fs.writeFileSync(b.filepath, content, { encoding: 'binary' });
}
module.exports.allread1 = allread1;
module.exports.allRead = allRead;
module.exports.xlsxRead = xlsxRead;
module.exports.xlsxAppendSheet = xlsxAppendSheet;
module.exports.xlsxUpdateSheet = xlsxUpdateSheet;
module.exports.xlsxChangeRow = xlsxChangeRow;