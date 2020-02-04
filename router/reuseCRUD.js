/*
재사용가능 mongoose CRUD 기능과 model처리
재사용가능한 CRUD는 ./controller/reuseCRUD.js
모든 모델을 한곳에서 처리함 ./model/models.js
*/

const auth = require("../passport/auth");
module.exports = (app, passport) => {
  const models = require("../model/models");

  app.use("/reuse/menu", require("../controller/reuseCRUD")(models.Menu));
  app.use("/reuse/control", require("../controller/reuseCRUD")(models.Control));
  app.use(
    "/reuse/accessgroup",
    require("../controller/reuseCRUD")(models.accessGroup)
  );
  app.use("/reuse/simple", require("../controller/reuseCRUD")(models.simple));

  //   /*mongodb api collection*/
  //   app.post('/CompanyAdd', company.create);
  //   app.get('/CompanyAll', company.findAll);
  //   app.get('/Company/:id', company.findOne);
  //   app.put('/Company/update/:id', company.update);
  //   app.delete('/Company/delete/:id', company.delete);
};
