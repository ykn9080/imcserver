/*
재사용가능 mongoose CRUD 기능과 model처리
재사용가능한 CRUD는 ./controller/reuseCRUD.js
모든 모델을 한곳에서 처리함 ./model/models.js
*/

const auth = require("../passport/auth");
module.exports = (app, passport) => {
  const models = require("../model/models");
  const crud = require("../controller/reuseCRUD");

  app.use("/reuse/menu", crud(models.Menu));
  app.use("/reuse/control", crud(models.Control));
  app.use("/reuse/accessgroup", crud(models.accessGroup));
};
