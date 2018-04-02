var express = require('express');
var bodyParser = require('body-parser');
var au = require('./modules/Authorization/Authorization');
var loginuser = require('./modules/Login/login');
var validation = require('./modules/Validation/validation');
var ob = require('./modules/Objecterror/objectError');
var validationName = require('./modules/Validation/validationName');
var validationNameByEdit = require('./modules/Validation/validationNamebyEdit');
var routesUser = require('./modules/Routes/RoutesUser');
var routesUsers = require('./modules/Routes/RoutesUsers');
var user = require('./modules/Database/SqlQuery');
var Promise = require("bluebird");

var app = express();
const port = 8081;
var headerHash;
var headerContry;
var arrayNames;
var row;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    if (req.method !== "OPTIONS") {
        next();
    }
    if (req.method === "OPTIONS") {
        res.send();
    }
});


app.use('/loginuser', loginuser);
app.use('/user', validationName);
app.use('/user/:id', validationNameByEdit);
app.use('/user', validation);
app.use('/user', routesUser);
app.use('/users', routesUsers);

app.use(function(req, res, next) {
    headerHash = req.headers["header-hash"];
    next();
});



app.listen(port);
console.log("Example app listening at http://%s:", port);