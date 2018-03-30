var express = require('express');
var router = express.Router();
var db = require('../Database/SqlQuery');
var uuidv4 = require('uuid/v4');
var bodyParser = require('body-parser');
var ob = require('../Objecterror/objectError');

var tokenForLogin;
var timestampForLogin;
const timeForLogin = 60000;
const countMin = 20;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', function(req, res) {
    var data = req.body;

    db.loginUserIntoApp(data).then(function(result) {
        if (result.length === 0) {
            res.status(406).json({
                message: ob.objERRORS.USER_LOGIN,
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
                                message: ob.objERRORS.TOKEN_INSERT,
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
                                message: ob.objERRORS.TOKEN_UPDATE,
                            });
                        });
                    }
                }).catch(function(error) {
                    res.status(400).json({
                        message: ob.objERRORS.CONNECT,
                    });
                });
            })
        }
    }).catch(function(error) {
        res.status(400).json({
            message: ob.objERRORS.CONNECT,
        });
    });
});

module.exports = router;