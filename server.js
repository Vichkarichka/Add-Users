var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mysql = require('promise-mysql');
var uuidv4 = require('uuid/v4');

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

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
}));

var connect = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Users',
    connectionLimit: 20,
});

function pushDataToDataBase(name, surname, age, password, role) {
    var people = {
        nameuser: name,
        surnameuser: surname,
        age: age,
        password: password,
        role: role,
    };
    connect.getConnection().then(function(conn) {
        var sql = "INSERT INTO Human SET ?";
        var result = conn.query(sql, people, function(err, result, fields) {
            if (err) throw err;
            conn.release(conn);
        });
    }).catch(function(error) {
        res.status(422).json({
            message: "USER_CREATE_ERROR",
        });
    });
}

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

    connect.getConnection().then(function(conn) {
        var sql = "SELECT Userid, token, timestamp FROM LoginUsershash WHERE token = ?";
        var resultTimestamp = conn.query(sql, headerHash);
        conn.release(conn);
        return resultTimestamp;
    }).then(function(rows) {
        if (rows.length === 0) {
            res.status(404).json({
                message: "INVALID_TOKEN",
            });
        } else {
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                connect.getConnection().then(function(conn) {
                    var sql = "SELECT role, id FROM Human WHERE id = ?";
                    var resultRole = conn.query(sql, row.Userid);
                    conn.release(conn);
                    return resultRole;
                }).then(function(rows) {
                    Object.keys(rows).forEach(function(key) {
                        var row = rows[key];
                        headerRole = row.role;
                        headerId = row.id;
                    });
                }).catch(function(error) {
                    res.status(404).json({
                        message: "USER_INFO_ERROR",
                    });
                });
                if (row.timestamp > Date.now()) {
                    next();
                } else {
                    res.status(403).json({
                        message: "TIMESTAMP_TIMEOUT",
                    });
                }
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: "INVALID_TOKEN",
        });
    });
}

app.post('/user', function(req, res, next) {
    var data = req.body;

    connect.getConnection().then(function(conn) {
        var sql = "SELECT nameuser FROM Human WHERE nameuser = ?";
        var resultName = conn.query(sql, data.name);
        conn.release(conn);
        return resultName;
    }).then(function(rows) {
        if (rows.length === 0) {
            return next();
        } else {
            res.status(409).json({
                message: "USER_CREATE_ERROR",
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: "USER_INFO_ERROR",
        });
    });
});

app.post('/user/:id', function(req, res, next) {
    var data = req.body;

    connect.getConnection().then(function(conn) {
        var sql = "SELECT nameuser, id FROM Human WHERE nameuser = ?";
        var resultName = conn.query(sql, data.name);
        conn.release(conn);
        return resultName;
    }).then(function(rows) {
        if (rows.length === 0 || rows[0].id === parseInt(req.params.id)) {
            return next();
        } else {
            res.status(409).json({
                message: "USER_CREATE_ERROR",
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: "USER_INFO_ERROR",
        });
    });
});

app.post('/user', function(req, res, next) {

    req.checkBody('name', 'Invalid field Name values').notEmpty().isAlpha();
    req.checkBody('surname', 'Invalid field Surname values').notEmpty().isAlpha();
    req.checkBody('age', 'Invalid field Age values').notEmpty().isInt();
    req.checkBody('password', 'Invalid field Password values').notEmpty().isLength({
        min: 5
    });

    var errors = req.validationErrors();

    if (errors) {
        for (var i = 0; i < errors.length; i++) {
            res.status(400).send('Error: ' + errors[i].msg);
            return;
        }
    } else {
        next();
    }
});

app.post('/user', function(req, res) {
    var data = req.body;
    pushDataToDataBase(data.name, data.surname, data.age, data.password, data.role);
    res.status(201).send("Successfully");
});

app.post('/user/:id', checkTokenForDataBase, function(req, res) {
    var data = req.body;
    var sql = "UPDATE Human SET nameuser = ?, surnameuser = ?, age = ?, password = ?, role = ? WHERE id = ?";
    var dataPersons = [data.name, data.surname, data.age, data.password, data.role, req.params.id];

    connect.getConnection().then(function(conn) {
        var resultUpdate = conn.query(sql, dataPersons);
        conn.release(conn);
        return resultUpdate;
    }).then(function(rows) {
        res.status(200).json({
            message: "Successfully"
        });
    }).catch(function(error) {
        res.status(406).json({
            message: "USER_UPDATE_ERROR"
        });
    });
});

app.post('/loginuser', function(req, res) {
    var data = req.body;
    var sql = "SELECT nameuser, password, role, id FROM Human WHERE nameuser = ? AND password = ?";

    connect.getConnection().then(function(conn) {
        var resultLogin = conn.query(sql, [data.name, data.password]);
        conn.release(conn);
        return resultLogin;
    }).then(function(rows) {
        if (rows.length === 0) {
            res.status(406).json({
                message: "USER_LOGIN_ERROR"
            });
        } else {
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                connect.getConnection().then(function(conn) {
                    var userIdIntoDataBase = conn.query("SELECT Userid, token, timestamp FROM LoginUsershash WHERE Userid  = ?", row.id);
                    conn.release(conn);
                    return userIdIntoDataBase;
                }).then(function(rows) {
                    if (rows.length === 0) {
                        connect.getConnection().then(function(conn) {
                            tokenForLogin = uuidv4();
                            timestampForLogin = Date.now() + (timeForLogin * countMin);
                            var tempUser = {
                                Userid: row.id,
                                token: tokenForLogin,
                                timestamp: timestampForLogin,
                            };
                            var tempLogin = conn.query("INSERT INTO LoginUsershash SET ? ", tempUser);
                            conn.release(conn);
                            return tempLogin;
                        }).then(function(rows) {
                            res.status(200);
                            res.json({
                                'hash': tokenForLogin,
                            });
                            return;
                        }).catch(function(error) {
                            res.status(406).json({
                                message: "TOKEN_INSERT_ERROR"
                            });
                        });
                    } else {
                        tokenForLogin = uuidv4();
                        timestampForLogin = Date.now() + (timeForLogin * countMin);
                        var sql = "UPDATE LoginUsershash SET  token = ?, timestamp = ? WHERE Userid = ?";
                        var dataToken = [tokenForLogin, timestampForLogin, row.id];
                        connect.getConnection().then(function(conn) {
                            var resultUpdateForToken = conn.query(sql, dataToken);
                            conn.release(conn);
                            return resultUpdateForToken;
                        }).then(function(rows) {
                            res.status(200).json({
                                'hash': tokenForLogin,
                            });
                        }).catch(function(error) {
                            res.status(406).json({
                                message: "TOKEN_UPDATE_ERROR"
                            });
                        });
                    }
                }).catch(function(error) {
                    res.status(400).json({
                        message: "CONNECT_ERROR"
                    });

                });
            });
        }
    }).catch(function(error) {
        res.status(400).json({
            message: "CONNECT_ERROR"
        });
    });
});

app.get('/user/:id', checkTokenForDataBase, function(req, res) {

    if (headerRole === Role_Guest) {
        res.status(403).json({
            message: "USER_RIGTHS_ERROR"
        });
    }
    if (headerRole === Role_User) {
        if (headerId === req.params.id) {
            connect.getConnection().then(function(conn) {
                var sql = "SELECT nameuser, surnameuser, age, password, role, id FROM Human WHERE id = ?";
                var resultInfo = conn.query(sql, req.params.id);
                conn.release(conn);
                return resultInfo;
            }).then(function(rows) {
                res.status(200).json(rows);
            }).catch(function(error) {
                res.status(406).json({
                    message: "USER_INFO_ERROR"
                });
            });
        } else {
            res.status(403).json({
                message: "USER_RIGTHS_ERROR"
            });
        }
    } else {
        connect.getConnection().then(function(conn) {
            var sql = "SELECT nameuser, surnameuser, age, password, role, id FROM Human WHERE id = ?";
            var resultInfo = conn.query(sql, req.params.id);
            conn.release(conn);
            return resultInfo;
        }).then(function(rows) {
            res.status(200).json(rows);
        }).catch(function(error) {
            res.status(400).json({
                message: "CONNECT_ERROR"
            });
        });
    }
});

app.delete('/user/:id', checkTokenForDataBase, function(req, res) {

    if (headerRole === Role_Admin) {
        connect.getConnection().then(function(conn) {
            var sql = "DELETE FROM Human WHERE id = ?";
            var resultDelete = conn.query(sql, req.params.id);
            conn.release(conn);
            return resultDelete;
        }).then(function(rows) {
            res.status(200).json({
                message: "User delete",
            });
        }).catch(function(error) {
            res.status(406).json({
                message: "USER_DELETE_ERROR"
            });
        });
    } else {
        res.status(403).json({
            message: "USER_RIGTHS_ERROR"
        });
    }
});

app.get('/users', checkTokenForDataBase, function(req, res) {

    if (headerRole === Role_Guest) {
        connect.getConnection().then(function(conn) {
            var sql = "SELECT nameuser, surnameuser, age, password, role, id FROM Human WHERE id = ?";
            var resultShow = conn.query(sql, headerId);
            conn.release(conn);
            return resultShow;
        }).then(function(rows) {
            res.status(200).send(rows);
        }).catch(function(error) {
            res.status(400).json({
                message: "CONNECT_ERROR",
            });
        });
    } else {
        connect.getConnection().then(function(conn) {
            var sql = "SELECT nameuser, surnameuser, age, password, role, id FROM Human";
            var resultShow = conn.query(sql);
            conn.release(conn);
            return resultShow;
        }).then(function(rows) {
            res.status(200).send(rows);
        }).catch(function(error) {
            res.status(400).json({
                message: "CONNECT_ERROR",
            });
        });
    }
});

app.listen(port);
console.log("Example app listening at http://%s:", port);