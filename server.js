var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');
//Apollo, graphql setting
const { ApolloServer, gql } = require("apollo-server-express");
var { makeExecutableSchema } = require("graphql-tools");
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
//const schema = require('./graphql');
//const apServer = new ApolloServer({ typeDefs, resolvers });

const apServer = new ApolloServer({
    typeDefs,
    resolvers
});
apServer.applyMiddleware({ app });

app.use(cors())


//app.use(cookieParser());
//app.set('router', __dirname + '/router/main');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(morgan("combined"));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set up default mongoose connection
const config = require('./config');
//var mongoDB='mongodb://yknam:ykn9080@ds135399.mlab.com:35399/imcdb';
mongoose.connect(config.currentsetting.datasrc, { useNewUrlParser: true, useFindAndModify: false });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


require('./database/mssql.js');


var expressSession = require('express-session');
app.use(expressSession({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//  const jwtStrategry  = require("./strategies/jwt")
// passport.use(jwtStrategry);

app.use(passport.initialize());
var initPassport = require('./passport/init');
initPassport(passport);
//app.use(passport.session());
//
// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());
require('./api/googleapis');

require('./router/index.js')(app, passport);


app.set('port', process.env.PORT || 3001);
var server = app.listen(app.get('port'), function() {
    console.log('Server is running on Port!!: ', server.address().port);
});

// //this is for openshift
// var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
// var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
//
// app.listen(server_port, server_ip_address, function () {
//   console.log( "Listening on " + server_ip_address + ", port " + server_port )
// });