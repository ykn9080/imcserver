var func=require('../function/api');
module.exports = (app) => {
  const api = require('../controller/api');
  app.post('/ReadDataMy', api.readDataMy);
  app.post('/ReadDataSingle', api.ReadDataSingle);
  app.post('/UpdateDataPost', api.UpdateDataPost);
  // app.post('/UpdateDataMy', api.UpdateDataMy);
  // app.post('/DelDataPost', api.DelDataPost);
  // app.post('/DelDataMy', api.DelDataMy);
  // app.post('/SaveDataPost', api.SaveDataPost);
  // app.post('/SaveDataMy', api.SaveDataMy);
};
