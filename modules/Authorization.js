var express = require('express');
var db = require('./SqlQuery');

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

exports.checkTokenForDataBase = function checkTokenForDataBase(req, res, next) {
    var headerHash = req.headers["header-hash"];
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
                        req.body.Role = row.role;
                        req.body.Id = row.id;
                    });
                }).catch(function(error) {
                    res.status(404).json({
                        message: objERRORS.USER_INFO,
                    });
                }).then(function(result) {
                     if (row.timestamp > Date.now()) {
                    next();
                } else {
                    res.status(403).json({
                        message: objERRORS.TIMESTAMP_TIMEOUT,
                    });
                }
                })
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: objERRORS.INVALID_TOKEN,
        });
    });
}
