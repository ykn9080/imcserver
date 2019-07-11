module.exports = (app) => {
  const api = require('../controller/api');
  const company=require('../controller/company');
  /*json api collection*/
  app.post('/ReadDataMy', api.readDataMy);
  app.post('/ReadDataSingle', api.ReadDataSingle);
  app.post('/UpdateDataPost', api.UpdateDataPost);
  app.post('/ReadData', api.ReadData);
  app.post('/ReadDataList', api.ReadDataList);
  app.post('/UpdateDataMy', api.UpdateDataMy);
  /*mongodb api collection*/
  app.post('/CompanyAdd', company.create);
  app.get('/CompanyAll', company.findAll);
  app.get('/Company/:id', company.findOne);
  app.put('/Company/update/:id', company.update);
  app.delete('/Company/delete/:id', company.delete);
};
