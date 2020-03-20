var User = require('../model/user.js');
var config = require('../config/');
var filefunc = require('../function/filefunc');
var crudfunc = require('../function/crudfunc');
var getAllChildren = require('../function/getAllChildren');

const models = require('../model/models');

module.exports = (app, passport) => {
    /* GET ALL PRODUCTS */
    console.log('im in login');
    app.get('/login/id', function(req, res) {
        // render the page and pass in any flash data if it exists
        //res.render('login.html', {message: req.flash('loginMessage')});
        User.find({ "id": req.params.id })
            //Table.findById(req.params.id)
            .then(result => {
                if (!result) {
                    return res.status(404).send({
                        message: "data not found with id " + req.params.id
                    });
                }
                res.send(result);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "user not found with id " + req.params.id
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving user with id " + req.params.id
                });
            });
    });

    app.post('/login', function(req, res, next) {
        // generate the authenticate method and pass the req/res
        passport.authenticate('login', function(err, user, info) {

            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(info); //res.redirect('/');
            }

            // req / res held in closure
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                jwt(user);
                //res.json(user);
            });

            async function jwt(user) {
                const jwt = require('jsonwebtoken');
                var uuid;

                switch (config.basic.passport.datasrc) {
                    case "json":
                        uuid = user.id;
                        break;
                    case "mongodb":
                        uuid = user._id;
                        break;
                }
                var payload = {
                    // email: user.local.email,
                    // password:user.local.password,
                    _id: uuid
                };

                const JWTToken = jwt.sign(payload, config.basic.passport.jwtSecret, { expiresIn: '6h' });
                const myinfo = user.comp + "," + user.id;
                //    if(user.group=="SystemAdmins")  myinfo="";
                var spath = filefunc.findpathread("/data/json/imctable.json", myinfo);
                var spath1 = filefunc.findpathread("/data/json/imcdata.json", myinfo);
                var spath2 = filefunc.findpathread("/data/json/imcsetting.json", user.comp + ",");
                var spath3 = filefunc.findpathread("/data/json/imclist.json", myinfo);
                var file = crudfunc.readFile(spath);
                var system = crudfunc.readFile(spath2);
                var list = crudfunc.readFile(spath3);
                if (system != "") system = JSON.parse(system);
                // var css=system.csslist;
                // delete system.csslist;
                const usermenu = await models.Menu.find({ comp: user.comp, type: "user" });
                var imcdata = JSON.parse(crudfunc.readFile(spath1));
                // imcdata = removedatalist(imcdata);
                //console.log("spath:", spath, "myinfo:", myinfo, "obj.key:", Object.keys(JSON.parse(file)));
                return res.status(200).json({ token: JWTToken, user: user, list: list, system: system, file: file, dtsrc: JSON.stringify(imcdata), menu: JSON.stringify(usermenu) });
            }
        })(req, res, next);
    });

    function removedatalist(imcdata) {
        imcdata.forEach(dtsrc => {
            if (dtsrc.dtype == "database") {
                if (dtsrc.hasOwnProperty("querylist")) {
                    (dtsrc.querylist).forEach(k => {
                        if (k.sqlcommand == "select") {
                            k.datalist = [];
                        }
                    });
                }
            }
        });

        return imcdata;
    }

}