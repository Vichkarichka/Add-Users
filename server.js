var express = require('express');
var bodyParser = require('body-parser');
var db = require('./modules/Database/SqlQuery');
var au = require('./modules/Authorization/Authorization');
var loginuser = require('./modules/Login/login');
var validation = require('./modules/Validation/validation');
var ob = require('./modules/Objecterror/objectError');
var validationName = require('./modules/Validation/validationName');
var validationNameByEdit = require('./modules/Validation/validationNamebyEdit');
var Promise = require("bluebird");

var app = express();
const port = 8081;
var headerHash;
const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";
var arrayNames;
var row;

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

app.use('/loginuser',loginuser);
app.use('/user',validationName);
app.use('/user/:id',validationNameByEdit);
app.use('/user', validation);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    headerHash = req.headers["header-hash"];
    next();
});

app.post('/user', function(req, res) {
    var data = req.body;
    db.pushDataToDataBase(data.name, data.surname, data.age, data.password, data.role).then(function(result) {
        if (result.length !== 0) {
            res.status(201).send("Successfully");
        } else {
            res.status(409).json({
                message: ob.objERRORS.USER_CREATE,
            });
        }
    });
});

app.post('/user/:id', au.checkTokenForDataBase, function(req, res) {
    var data = req.body;
    db.updateDataInDataBase(data.name, data.surname, data.age, data.password, data.role, req.params.id).then(function(result) {
        res.status(200).json({
            message: "Successfully"
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_UPDATE,
        });
    });
});

app.get('/user/:id', au.checkTokenForDataBase, function(req, res) {
    if(req.body.Role  === Role_Guest) {
        res.status(403).json({
            message: ob.objERRORS.USER_RIGTHS,
        });
    }
    if(req.body.Role === Role_User) {
        if (req.body.Id === req.params.id) {
            db.selectAllInformation(req.params.id).then(function(result) {
                res.status(200).json(result);
            }).catch(function(error) {
                res.status(406).json({
                    message: ob.objERRORS.USER_INFO,
                });
            });
        } else {
            res.status(403).json({
                message: ob.objERRORS.USER_RIGTHS,
            });
        }
    } else {
        db.selectAllInformation(req.params.id).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json({
                message: ob.objERRORS.CONNECT,
            });
        });
    }
});

app.delete('/user/:id', au.checkTokenForDataBase, function(req, res) {

    if(req.body.Role === Role_Admin) {
    	db.deletePersonOfDataBase(req.params.id).then(function(result) {
    		 res.status(200).json({
                message: "User delete",
            });
    	}).catch(function(error) {
            res.status(406).json({
                message: ob.objERRORS.USER_DELETE,
            });
        });
    } else {
    	res.status(403).json({
            message: ob.objERRORS.USER_RIGTHS,
        });
    }
});

app.get('/users', au.checkTokenForDataBase, function(req, res) {

    if(req.body.Role === Role_Guest) {
        db.selectAllInformation(req.body.Id).then(function(result) {
            res.status(200).send(result);
        }).catch(function(error) {
            res.status(400).json({
                message: ob.objERRORS.CONNECT,
            });
        });
    } else {
        db.selectAllInformationDB().then(function(result) {
            res.status(200).send(result);
        }).catch(function(error) {
            res.status(400).json({
                message: ob.objERRORS.CONNECT,
            });
        });
    }
});

app.listen(port);
console.log("Example app listening at http://%s:", port);