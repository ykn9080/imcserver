/*
재사용가능 mongoose CRUD 기능과 model처리
재사용가능한 CRUD는 ./controller/reuseCRUD.js
모든 모델을 한곳에서 처리함 ./model/models.js
*/

const auth = require("../passport/auth");
module.exports = (app, passport) => {
  const models = require("../model/models");

  app.use("/menu", require("../controller/reuseCRUD")(models.Menu));
  app.use("/control", require("../controller/reuseCRUD")(models.Control));
  app.use(
    "/accessgroup",
    require("../controller/reuseCRUD")(models.accessGroup)
  );
  app.use("/reuse/simple", require("../controller/reuseCRUD")(models.simple));
};
