// config.js
const config = {
 mongodb: {
   local: 'mongodb://localhost:27017/local',
   mlab:'mongodb://yknam:ykn9080@ds135399.mlab.com:35399/imcdb',
   azure:'mongodb://youngkinam:VW6yH00l5CgsyT5NurqmDEEYycgKKQLevSiS0mONgHCoNJO0Wl7BjegxUorBJpXT7I7PiYx8023FSPQpwlrAcQ%3D%3D@youngkinam.documents.azure.com:10255/?ssl=true'
 }
 ,mssql:{
   smarterasp: {
     user: 'DB_9D66CD_imcmaster_admin',
     password: 'ykn90809080',
     server: 'SQL5004.Smarterasp.net',
     database: 'DB_9D66CD_imcmaster'
 }
}
,passport:{
  jwtSecret:"hellohello"
  //,datasrc:'json'//json,mongodb,mssql
  ,datasrc:'mongodb'
  ,username:'id'//_id,username,email
  ,password:'password'
}

};
const currentsetting={
  datasrc:config.mongodb.local

}
module.exports = {config,currentsetting};
