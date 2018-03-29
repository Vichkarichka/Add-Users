var express = require('express');
var router = express.Router();
var db = require('./SqlQuery');
var uuidv4 = require('uuid/v4');
var bodyParser = require('body-parser');

var tokenForLogin;
var timestampForLogin;
const timeForLogin = 60000;
const countMin = 20;

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
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', function(req, res) {
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

module.exports = router;