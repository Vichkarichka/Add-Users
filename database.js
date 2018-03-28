var mysql = require('promise-mysql');
var express = require('express');

var connect = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Users',
    connectionLimit: 20,
});

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

exports.checkName = function checkDoubleName(req, res, next, data) {

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
                message: objERRORS.USER_CREATE,
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: objERRORS.USER_INFO,
        });
    });
}
