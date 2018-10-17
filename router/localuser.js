// var express = require('express');
// var app = express();
const auth=require('../passport/auth');
const pass=require('../passport/login');

module.exports = (app,passport) => {
    const user = require('../controller/localuser');
    //    const api = require('../controller/api');
  //app.post('/readdata', api.readdata);
    // Create a new Note
    app.post('/localuser', user.create);

    // Retrieve all user
    //app.get('/localuser', auth.authenticate,user.findAll);
    app.get('/localuser',auth().authenticate(), user.findAll);

    // Retrieve a single Note with noteId
    app.get('/localuser/get/:id', auth().authenticate(), user.findOne);//passport.authenticate('jwt', {session: false}), user.findOne);//  passport.authenticate('jwt', {session: false}), user.findOne);//

    // Update a Note with noteId
    app.put('/localuser/update/:name', user.update);

    // Delete a Note with noteId
    app.delete('/localuser/delete/:name', user.delete);


}
