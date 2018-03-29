var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var db = require('./SqlQuery');
var Promise = require("bluebird");

var app = express();
const port = 8081;
const timeForLogin = 60000;
const countMin = 20;
var headerId;
var headerRole;
var headerHash;
const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";
var arrayNames;
var row;
var tokenForLogin;
var timestampForLogin;

const objERRORS = {
    USER_LOGIN: "USER_LOGIN_ERROR",
    USER_CREATE: "USER_CREATE_ERROR",
    USER_INFO: "USER_INFO_ERROR",
    USER_UPDATE: "USER_UPDATE_ERROR",
    USER_RIGTHS: "USER_RIGTHS_ERROR",
    USER_DELETE: "USER_DELETE_ERROR",
    TIMESTAMP_TIMEOUT: "TIMESTAMP_TIMEOUT_ERROR",
    INVALID_TOKEN: "INVALID_TOKEN_ERROR",
    TOKEN_INSERT: "TOKEN_INSERT_ERROR",
    TOKEN_UPDATE: "TOKEN_UPDATE_ERROR",
    CONNECT: "CONNECT_ERROR",
    USER_NAME: "USER_NAME_ERROR",
    USER_SURNAME: "USER_SURNAME_ERROR",
    USER_AGE: "USER_AGE_ERROR",
    USER_PASSWORD: "USER_PASSWORD_ERROR",
};

app.use(bodyParser.json());
app.use(expressValidator());
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

app.use(function(req, res, next) {
    headerHash = req.headers["header-hash"];
    next();
});

function checkTokenForDataBase(req, res, next) {

    db.checkToken(headerHash).then(function(result) {
        if (result.length === 0) {
            res.status(404).json({
                message: objERRORS.INVALID_TOKEN,
            });
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                db.checkRoleIntoDataBase(row.Userid).then(function(result) {
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        headerRole = row.role;
                        headerId = row.id;
                    });
                }).catch(function(error) {
                    res.status(404).json({
                        message: objERRORS.USER_INFO,
                    });
                });
                if (row.timestamp > Date.now()) {
                    next();
                } else {
                    res.status(403).json({
                        message: objERRORS.TIMESTAMP_TIMEOUT,
                    });
                }
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: objERRORS.INVALID_TOKEN,
        });
    });
}

app.post('/user', function(req, res, next) {
    var data = req.body;

    db.checkName(data).then(function(result) {
        if (result.length === 0) {
            return next();
        } else {
            res.status(409).json({
                message: objERRORS.USER_CREATE,
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: objERRORS.USER_INFO,
        });
    });
});

app.post('/user/:id', function(req, res, next) {
    var data = req.body;

    db.checkName(data).then(function(result) {
        if (result.length === 0 || result[0].id === parseInt(req.params.id)) {
            return next();
        } else {
            res.status(409).json({
                message: objERRORS.USER_CREATE,
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: objERRORS.USER_INFO,
        });
    });
});

app.post('/user', function(req, res, next) {

    req.checkBody('name', objERRORS.USER_NAME).notEmpty().isAlpha();
    req.checkBody('surname', objERRORS.USER_SURNAME).notEmpty().isAlpha();
    req.checkBody('age', objERRORS.USER_AGE).notEmpty().isInt();
    req.checkBody('password', objERRORS.USER_PASSWORD).notEmpty().isLength({
        min: 5
    });

    var errors = req.validationErrors();

    if (errors) {
        for (var i = 0; i < errors.length; i++) {
            res.status(400).json({
                message: errors[i].msg,
            });
            return;
        }
    } else {
        next();
    }
});

app.post('/user', function(req, res) {
    var data = req.body;
    db.pushDataToDataBase(data.name, data.surname, data.age, data.password, data.role).then(function(result) {
        if (result.length !== 0) {
            res.status(201).send("Successfully");
        } else {
            res.status(409).json({
                message: objERRORS.USER_CREATE,
            });
        }
    });
});

app.post('/user/:id', checkTokenForDataBase, function(req, res) {
    var data = req.body;
    db.updateDataInDataBase(data.name, data.surname, data.age, data.password, data.role, req.params.id).then(function(result) {
        res.status(200).json({
            message: "Successfully"
        });
    }).catch(function(error) {
        res.status(406).json({
            message: objERRORS.USER_UPDATE,
        });
    });
});

app.post('/loginuser', function(req, res) {
    var data = req.body;

    db.loginUserIntoApp(data).then(function(result) {
        if (result.length === 0) {
            res.status(406).json({
                message: objERRORS.USER_LOGIN,
            });
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                db.findTokenInDataBase(row).then(function(result) {
                    if (result.length === 0) {
                        tokenForLogin = uuidv4();
                        timestampForLogin = Date.now() + (timeForLogin * countMin);
                        db.insertTokenInDataBase(row, tokenForLogin, timestampForLogin).then(function(result) {
                            res.status(200);
                            res.json({
                                'hash': tokenForLogin,
                            });
                            return;
                        }).catch(function(error) {
                            res.status(406).json({
                                message: objERRORS.TOKEN_INSERT,
                            });
                        });
                    } else {
                        tokenForLogin = uuidv4();
                        timestampForLogin = Date.now() + (timeForLogin * countMin);
                        db.updateTokenInDataBase(row, tokenForLogin, timestampForLogin).then(function(result) {
                            res.status(200).json({
                                'hash': tokenForLogin,
                            });
                        }).catch(function(error) {
                            res.status(406).json({
                                message: objERRORS.TOKEN_UPDATE,
                            });
                        });
                    }
                }).catch(function(error) {
                    res.status(400).json({
                        message: objERRORS.CONNECT,
                    });
                });
            })
        }
    }).catch(function(error) {
        res.status(400).json({
            message: objERRORS.CONNECT,
        });
    });
});

app.get('/user/:id', checkTokenForDataBase, function(req, res) {
    if(headerRole === Role_Guest) {
        res.status(403).json({
            message: objERRORS.USER_RIGTHS,
        });
    }
    if(headerRole === Role_User) {
        if (headerId === req.params.id) {
            db.selectAllInformation(req.params.id).then(function(result) {
                res.status(200).json(result);
            }).catch(function(error) {
                res.status(406).json({
                    message: objERRORS.USER_INFO,
                });
            });
        } else {
            res.status(403).json({
                message: objERRORS.USER_RIGTHS,
            });
        }
    } else {
        db.selectAllInformation(req.params.id).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json({
                message: objERRORS.CONNECT,
            });
        });
    }
});

app.delete('/user/:id', checkTokenForDataBase, function(req, res) {

    if(headerRole === Role_Admin) {
    	db.deletePersonOfDataBase(req.params.id).then(function(result) {
    		 res.status(200).json({
                message: "User delete",
            });
    	}).catch(function(error) {
            res.status(406).json({
                message: objERRORS.USER_DELETE,
            });
        });
    } else {
    	res.status(403).json({
            message: objERRORS.USER_RIGTHS,
        });
    }
});

app.get('/users', checkTokenForDataBase, function(req, res) {

    if(headerRole === Role_Guest) {
        db.selectAllInformation(headerId).then(function(result) {
            res.status(200).send(result);
        }).catch(function(error) {
            res.status(400).json({
                message: objERRORS.CONNECT,
            });
        });
    } else {
        db.selectAllInformationDB().then(function(result) {
            res.status(200).send(result);
        }).catch(function(error) {
            res.status(400).json({
                message: objERRORS.CONNECT,
            });
        });
    }
});

app.listen(port);
console.log("Example app listening at http://%s:", port);