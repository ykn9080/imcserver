/*
재사용가능한 CRUD로 모든 모델에서 공통사용
모든 모델을 한곳에서 처리함 ./model/models.js
/router/reuseCRUD.js에서 접근처리
2020.2.6
*/

const express = require("express");

module.exports = Collection => {
  // ======
  // Create
  // ======
  const create = (req, res) => {
    const newEntry = req.body;
    Collection.create(newEntry, (e, newEntry) => {
      if (e) {
        console.log(e);
        res.sendStatus(500);
      } else {
        res.send(newEntry);
      }
    });
  };

  // =========
  // Read many
  // =========
  const readMany = (req, res) => {
    let query = res.locals.query || {};

    Collection.find(query, (e, result) => {
      if (e) {
        res.status(500).send(e);
        console.log(e.message);
      } else {
        res.send(result);
      }
    });
  };

  // ========
  // Read one
  // ========
  const readOne = (req, res, next) => {
    /* reqest.query 경우
      예: http://localhost:3001/reuse/control/:_id?ctrid=gggg
    */
    if (Object.keys(req.query).length > 0) {
      var query = Collection.find(req.query);
      query.exec(function(err, someValue) {
        if (err) return next(err);
        res.send(someValue);
      });
      return null;
    }
    /* request.param 경우
      예: http://localhost:3001/reuse/control/:_id
      control/:_id
    */
    let { _id } = req.params;
    Collection.findById(_id, (e, result) => {
      if (e) {
        res.status(500).send(e);
        console.log(e.message);
      } else {
        //res.send(result);
        res.send(result);
      }
    });
  };

  // ======
  // Update
  // ======
  const update = (req, res) => {
    const keycode = Object.keys(req.query);
    const changedEntry = req.body;

    // ======
    // MultiUpdate: array로 batch update처리
    // url은 "/mutiupdate?id="과 같이 전송
    // 현재는 multiupdate시 querystring 1개만 가능!!!!!!!!!! 수정할것
    // ======
    if (req.params._id == "multiupdate") {
      let bulk = Collection.collection.initializeUnorderedBulkOp();
      changedEntry.forEach((k, i) => {
        bulk
          .find({ [keycode]: k[keycode] })
          .upsert()
          .update({ $set: k });
      });

      bulk.execute((e, result) => {
        if (e) {
          res.status(500).send(e);
          console.log(e.message);
        } else {
          res.send(result);
        }
      });
      return false;
    }

    //single update인 경우
    let query = { _id: req.params._id };
    if (keycode.length > 0) {
      //querystring이 있을 경우 query를 대체함
      //localhost:3001/menu/<req.param._id>?qrystring=value
      query = req.query;
    }
    Collection.update(query, { $set: changedEntry }, e => {
      if (e) res.sendStatus(500);
      else res.sendStatus(200);
    });
  };

  // ======
  // Remove
  // ======
  const remove = (req, res) => {
    let query = { _id: req.params._id };
    //querystring이 있을 경우 query를 대체함
    if (Object.keys(req.query).length > 0) {
      query = req.query;
    }
    Collection.remove(query, e => {
      if (e) res.status(500).send(e);
      else res.sendStatus(200);
    });
  };

  // ======
  // Routes
  // ======

  let router = express.Router();

  router.post("/", create);
  router.get("/", readMany);
  router.get("/:_id", readOne);
  router.put("/:_id", update);
  router.delete("/:_id", remove);

  return router;
};
