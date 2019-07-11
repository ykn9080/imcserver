var path = require('path');
var filefunc=require('./filefunc');
var fs = require('fs');

var root = path.join("__dirname__", "../");
function multidepthfind(dt,dataname){
  var arr = dataname.split('.'),sdt;
    switch (arr.length)
    {
        case 1:
            sdt=dt[dataname]
            break;
        case 2:
            sdt=dt[arr[0]][arr[1]];
            break;
        case 3:
            sdt=dt[arr[0]][arr[1]][arr[2]];
            break;
        case 4:
            sdt=dt[arr[0]][arr[1]][arr[2]][arr[3]];
            break;
    }
    return sdt;
}
function multidepthupdate(dt,dataname,udt){
  var arr = dataname.split('.');
    switch (arr.length)
    {
        case 1:
            dt[dataname]=udt;
            break;
        case 2:
            dt[arr[0]][arr[1]]=udt;
            break;
        case 3:
            dt[arr[0]][arr[1]][arr[2]]=udt;
            break;
        case 4:
            dt[arr[0]][arr[1]][arr[2]][arr[3]]=udt;
            break;
    }

    return dt;
}
function readData (pth, dataname, keycode, keyvalue) {
    var dt =["no data"];
       if (fs.existsSync(pth))
     dt =JSON.parse(fs.readFileSync(pth, 'utf8'));
    if (dataname != ""){
        dt = multidepthfind(dt,dataname);
    }
    if (keycode != "") {
        dtt = dt.filter(function(value,index,array) {
            return value[keycode] ===keyvalue;
        });
        if (dtt.length == 1)
            dt = dtt[0];
        else
            dt = dtt;
    }

    return dt;
}
function updateVal(dt, keycode,keyvalue,udata){
  var chknew=true;
  for (i = 0; i < dt.length; ++i) {
    if (dt[i][keycode] == keyvalue) {
        dt.splice(i, 1, udata);
        chknew=false;

    }
  }
  if(chknew)
    dt.push(udata);
  return dt;
}
function deleteVal(dt, keycode,keyvalue){
    console.log("deleteVal: ", keycode,keyvalue)
  for (i = 0; i < dt.length; ++i) {
    if (dt[i][keycode] == keyvalue) {
        dt.splice(i, 1);
    }
  }
  return dt;
}
function updateData(path, udata, dataname, keycode, keyvalue)
{
    var rtn = "success";
   
    try
    {
        //relativepath: "/JS2/jquery-lang-js-master/js/langpack/kr.json"
        //var abpath = Server.MapPath(path);

         if (!fs.existsSync(path)) {
              filefunc.makeDirectory(abpath);
        }

        if (fs.existsSync(path))
        {

            var dt = JSON.parse(fs.readFileSync(path, 'utf8'));

            if (dataname != ""){
                var sdt=multidepthfind(dt,dataname);

                if (keycode != "") {
                   sdt=updateVal(sdt,keycode,keyvalue,udata);
                }
                else{
                    sdt=udata;
                }
                dt=multidepthupdate(dt,dataname,sdt);
                
            }
            else{
                if (keycode != "") {
                   dt=updateVal(dt,keycode,keyvalue,udata);
                }
                else{
                    dt=udata;
                }
            }

  
            fs.writeFile(path, JSON.stringify(dt), function(err) {
              // If an error occurred, show it and return
              if(err) return console.error(err);
              else
                return rtn=dt;
              // Successfully wrote binary contents to the file!
            });
        }
    }
    catch (err )
    {
         "save fail" + err.name;
    }
    return rtn;
}
function deleteData(path, dataname, keycode, keyvalue)
{
    var rtn = "success";
    try
    {
        //relativepath: "/JS2/jquery-lang-js-master/js/langpack/kr.json"
        //var abpath = Server.MapPath(path);

        if (fs.existsSync(path))
        {

            var dt = JSON.parse(fs.readFileSync(path, 'utf8'));

            if (dataname != ""){
                var sdt=multidepthfind(dt,dataname);

                if (keycode != "") {
                   sdt=deleteVal(sdt,keycode,keyvalue);
                }
                else{
                    sdt=udata;
                }
                dt=multidepthupdate(dt,dataname,sdt);
                
            }
            else{
                if (keycode != "") {
                   dt=deleteVal(dt,keycode,keyvalue);
                }
                else{
                    dt=udata;
                }
            }

  
            fs.writeFile(path, JSON.stringify(dt), function(err) {
              // If an error occurred, show it and return
              if(err) return console.error(err);
              else
                return rtn=dt;
              // Successfully wrote binary contents to the file!
            });
        }
    }
    catch (err )
    {
         "save fail" + err.name;
    }
    return rtn;
}
function readFile(spath) {
    //var spath = path.join(root, req.body.pathNfile);
    if (fs.existsSync(spath)) {
        var file = fs.readFileSync(spath, 'utf8');
        // if (file != "")
        //     file = JSON.parse(file);
        return file;
    }
    return false;
}

function writeFile(spath, content) {
    // var filename = path.basename(pathNfile); //Path.GetFileName(abpath);
    // var dir = path.dirname(pathNfile);
    // var rtn = makedirfile(dir, filename);
    //
    // makeDirectory(rtn);
    if (typeof content == "object")
        content = JSON.stringify(content);
    fs.writeFile(spath, content, function(err) {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    });
}


module.exports.readData = readData;
module.exports.readFile = readFile;
module.exports.writeFile = writeFile;
module.exports.updateData = updateData;
module.exports.deleteData = deleteData;
// //module.exports.readFi
// // public string ReadDataMy(string path, string myinfo, string dataname, string keycode, string keyvalue)
// //     {
// //         string spath = findpathread(path, myinfo);

// //         string rtn = ReadDataSingle(spath, dataname, keycode, keyvalue);
// //         if (path.IndexOf("imctable") > -1 )//| path.IndexOf("imcdata") > -1)
// //         {
// //             string imcdt = ReadDataSingle(path, dataname, keycode, keyvalue);
// //             JArray list = new JArray();
// //             list = JArray.Parse("[" + imcdt + "," + rtn + "]");
// //             rtn = list.ToString();
// //         }
// //         return rtn;
// //     }

// //     public string UpdateDataMy(string path,string myinfo, string udata, string dataname, string keycode, string keyvalue)
// //     {
// //         string spath = findpath(path, myinfo);
// //         string rtn = UpdateDataPost(spath, udata, dataname, keycode, keyvalue);
// //         return rtn;
// //     }

// //     public string DelDataMy(string path,string myinfo, string dataname, string keycode, string keyvalue)
// //     {
// //         string lreturn = "success";
// //         try
// //         {
// //             string spath = findpath(path, myinfo);
// //             if (dataname != "" | keycode != "")
// //                 lreturn += DelDataPost(path, dataname, keycode, keyvalue);
// //             else
// //             {
// //                 var abpath = Server.MapPath(spath);
// //                 if (Directory.Exists(abpath))
// //                 {
// //                     Directory.Delete(abpath, true);
// //                 }
// //                 lreturn += abpath;
// //             }
// //         }
// //         catch (Exception ex)
// //         {
// //             lreturn = "delete fail" + ex.ToString();
// //         }
// //         return lreturn;
// //     }

//     public string Readimcdata(string path, string myinfo, string keycode, string keyvalue)
//     {
//         string rtn = "";
//         string spath = findpath(path, myinfo);
//         string data= ReadDataSingle(spath, "", keycode, keyvalue);
//         if (data!= null && data!="") {
//             JObject obj = JObject.Parse(data);
//             string interval = (string)obj["interval"];
//             switch (interval) {
//                 case "realtime":
//                     break;
//             }
//         }
//         return rtn;
//     }

//     // public string ReadData(string path)
//     // {
//     //     string lreturn = "";
//     //     try
//     //     {
//     //         //relativepath: "/JS2/jquery-lang-js-master/js/langpack/kr.json"
//     //         var abpath = Server.MapPath(path);

//     //         if (File.Exists(abpath))
//     //         {
//     //             using (StreamReader streamReader = new StreamReader(abpath, Encoding.UTF8))
//     //             {
//     //                 lreturn = streamReader.ReadToEnd();
//     //                 streamReader.Close();
//     //             }
//     //         }
//     //         //lreturn += abpath;
//     //     }
//     //     catch (Exception ex)
//     //     {
//     //         lreturn = "save fail" + ex.ToString();
//     //     }
//     //     return lreturn;
//     // }



//     public string ReadDataSingle(string path,string dataname,string keycode,string keyvalue)
//     {
//         //path:location & json file name(/data/json/filename)
//         //dataname:Object within file, if imcdata none
//         //keycode,keyvalue:id field and id value, if not all list of dataname or path
//         //ex:'imcdata','','code','dt1234' or 'imcsetting','csslist','code','cs1234'
//         string realall = "", rtn = "";
//         try
//         {
//             //relativepath: "/JS2/jquery-lang-js-master/js/langpack/kr.json"
//             var abpath = Server.MapPath(path);
//             JArray list = new JArray();
//             JObject obj = new JObject();
//             if (File.Exists(abpath))
//             {
//                 using (StreamReader streamReader = new StreamReader(abpath, Encoding.UTF8))
//                 {
//                     realall = streamReader.ReadToEnd();
//                     if (dataname == "")
//                     {
//                         if (realall.Substring(0, 1) == "[")
//                             list = JArray.Parse(realall);
//                         else
//                             rtn = realall;
//                     }
//                     else
//                     {
//                         obj = JObject.Parse(realall);
//                         dynamic chk = (dynamic)multidepth(obj, dataname);
//                         if (chk != null)
//                         {
//                             var chunk = chk.ToString();// obj[dataname].ToString();
//                             if (chunk.Substring(0, 1) == "[")
//                                 list = (JArray)multidepth(obj, dataname);
//                             else
//                                 rtn = chunk;
//                         }
//                     }
//                     if (keycode != "")
//                     {
//                         JArray list1 = new JArray();
//                         foreach (JToken item in list)
//                         {

//                             if (multikeycheck(item, keycode, keyvalue) | item[keycode] == null)
//                             // if ((string)item[keycode] == keyvalue)
//                             {
//                                 rtn = item.ToString();
//                                 list1.Add(item);
//                             }
//                         }
//                         //if (list1.Count > 1)
//                         //    rtn = list1.ToString();
//                     }
//                     else if (rtn == "" && list.Count > 0)
//                         rtn = list.ToString();
//                 }
//             }
//         }
//         catch (Exception ex)
//         {
//             rtn = "save fail" + ex.ToString();
//         }
//         return rtn;
//     }
    
//     protected bool multikeycheck(JToken item, string keycode, string keyvalue)
//     {
//         //if keycode,keyvalue are plural, split and check all coincide 
//         string[] codearr = keycode.Split(',');
//         string[] valarr = keyvalue.Split(',');
//         var chk = false; var coincidenum = 0;
//         for (var i = 0; i < codearr.Length; i++)
//         {
//             var code = codearr[i];
//             var val = valarr[i];
//             if (item[code] != null && item[code].ToString() == val)
//                     coincidenum++;
//         }
//         if (codearr.Length == coincidenum)
//             chk = true;
//         return chk;
//     }
//     [WebMethod]
//     public string checkpath(string path, string dataname, string myinfo)
//     {
//         //check path json exists
//         string rtn = "False", comp = "", staff = "", spath = "", level = "imc", imcrtn = "", myrtn = "";
//         JArray list = new JArray();
//         JObject obj = new JObject();
//         if (myinfo != "")
//         {
//             string[] myinfos = myinfo.Split(',');
//             comp = myinfos[0];
//             if (comp != "")
//                 level = "comp";
//             if (myinfos.Length > 1)
//             {
//                 staff = myinfos[1];
//                 if (staff != "")
//                     level = "staff";
//             }
//         }

//         //relativepath: "/JS2/jquery-lang-js-master/js/langpack/kr.json"
//         var abpath = Server.MapPath(path);
//         var filename = Path.GetFileName(abpath);
//         var dir = Path.GetDirectoryName(abpath);
//         switch (level) {
//             case "staff":
//                 spath = path.Replace(filename, "") + comp + "/" + staff + "/" + filename;
//                 break;
//             case "comp":
//                 spath = path.Replace(filename, "") + comp + "/" + filename;
//                 break;
//             case "imc":
//                 spath = path;
//                 break;
//         }
//         abpath = Server.MapPath(spath);
//         if (File.Exists(abpath))
//         {
//             if (dataname == "")
//                 rtn = "True";
//             else
//             using (StreamReader streamReader = new StreamReader(abpath, Encoding.UTF8))
//             {
//                 var realall = streamReader.ReadToEnd();
//                 {
//                     obj = JObject.Parse(realall);
//                     dynamic chk = (dynamic)multidepth(obj, dataname);
//                         if (chk != null)
//                             rtn = "True";
//                 }
//             }
//         }
//         return rtn;
//     }



//     public string DelDataPost(string path, string dataname, string keycode, string keyvalue)
//     {
//         string realall = "", rtn = "test", rtn1 = "";
//         try
//         {
//             var abpath = Server.MapPath(path);
//             var chunk = "";
//             JArray list = new JArray();
//             JObject obj = new JObject();
//             if (File.Exists(abpath))
//             {
//                 using (StreamReader streamReader = new StreamReader(abpath, Encoding.UTF8))
//                 {
//                     realall = streamReader.ReadToEnd();
//                     if (dataname == "")
//                         list = JArray.Parse(realall);
//                     else
//                     //{
//                     //    obj = JObject.Parse(realall);
//                     //    if (keycode == "")
//                     //        obj.Remove(dataname);
//                     //    else
//                     //        list = (JArray)obj[dataname];
//                     //}
//                     {
//                         obj = JObject.Parse(realall);
//                         dynamic chk = (dynamic)multidepth(obj, dataname);
//                         if (chk == null)
//                             obj[dataname] = new JArray();
//                         chunk = multidepth(obj, dataname).ToString();// obj[dataname].ToString();
//                         if (chunk.Substring(0, 1) == "[")
//                             list = (JArray)multidepth(obj, dataname);
//                         else if (chunk.Substring(0, 1) == "{")
//                         {
//                             string[] arr = dataname.Split('.');
//                             switch (arr.Count())
//                             {
//                                 case 1:
//                                     list = (JArray)obj[dataname];
//                                     break;
//                                 case 2:
//                                     list = (JArray)obj[arr[0]][arr[1]];
//                                     break;
//                                 case 3:
//                                     list = (JArray)obj[arr[0]][arr[1]][arr[2]];
//                                     break;
//                                 case 4:
//                                     list = (JArray)obj[arr[0]][arr[1]][arr[2]][arr[3]];
//                                     break;
//                             }
//                         }
//                     }
//                     var i = 0;
//                     if (keycode != "")
//                         foreach (JToken item in list)
//                         {
//                             rtn1 += item[keycode] + "," + multikeycheck(item, keycode, keyvalue) + " | ";
//                             if (multikeycheck(item, keycode, keyvalue) | item[keycode] == null)
//                             //     if ((string)item[keycode] == keyvalue)
//                             {
//                                 rtn1 += "DEL!!!";
//                                 list.RemoveAt(i);
//                                 break;
//                             }
//                             i++;
//                         }

//                     if (dataname == "")
//                         rtn = list.ToString();
//                     else
//                         rtn = obj.ToString();


//                 }
//                 //write back to json file
//                 StreamWriter tw = new StreamWriter(abpath);
//                 tw.WriteLine(rtn);
//                 tw.Close();
//             }
//             rtn = list.ToString();
//         }
//         catch (Exception ex)
//         {
//             rtn = "delete fail" + ex.ToString();
//         }
//         return rtn1 + rtn;
//     }

//      public string SaveDataPost(string path, string str)
//     {
//         WebServiceManager ws = WebServiceManager.GetInstance();
//         string lreturn = "";
//         try
//         {
//             //var path = "/JS2/jquery-lang-js-master/js/langpack/kr.json";
//             var abpath = Server.MapPath(path);
//             System.IO.FileInfo file = new System.IO.FileInfo(abpath);
//             file.Directory.Create();

//             if (!File.Exists(abpath))
//             {
//                 File.Create(abpath).Dispose();
//             }
//             if (File.Exists(abpath))
//             {
//                 StreamWriter tw = new StreamWriter(abpath);
//                 tw.WriteLine(str);
//                 lreturn += str + tw.ToString();
//                 tw.Close();
//             }

//             //ws.WriteFile(abpath, str);
//             //System.IO.File.WriteAllText(@"D:\path.txt", datattl);
//             //JsonObject jo = new JsonObject(datattl);
//             lreturn += abpath;
//         }
//         catch (Exception ex)
//         {
//             lreturn = "save fail" + ex.ToString();
//         }
//         return lreturn;
//     }

//     public string SaveData(string path,string str)
//     {
//         string lreturn = "";
//         try
//         {
//             //var path = "/JS2/jquery-lang-js-master/js/langpack/kr.json";
//             var abpath = Server.MapPath(path);
//             if (!File.Exists(abpath))
//             {
//                 File.Create(abpath).Dispose(); 
//             }
//             if (File.Exists(abpath))
//             {
//                 StreamWriter tw = new StreamWriter(abpath);
//                 tw.WriteLine(str);
//                 lreturn += str+tw.ToString();
//                 tw.Close();
//             }

//             //ws.WriteFile(abpath, str);
//             //System.IO.File.WriteAllText(@"D:\path.txt", datattl);
//             //JsonObject jo = new JsonObject(datattl);
//             lreturn += abpath;
//         }
//         catch (Exception ex)
//         {
//             lreturn = "save fail"+ex.ToString();
//         }
//         return lreturn;
//     }