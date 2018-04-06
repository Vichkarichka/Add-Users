var express = require('express');
var user = require('../Database/SqlQuery');
var ob = require('../Objecterror/objectError');

exports.checkTokenForDataBase = function checkTokenForDataBase(req, res, next) {
    var headerHash = req.headers["header-hash"];
    console.log("1");
    user.checkToken(headerHash).then(function(result) {
        if (result.length === 0) {
            res.status(404).json({
                message: ob.objERRORS.INVALID_TOKEN,
            });
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                user.checkRoleIntoDataBase(row.Userid).then(function(result) {
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        req.body.Role = row.role;
                        req.body.Id = row.id;
                    });
                }).catch(function(error) {
                    res.status(404).json({
                        message: ob.objERRORS.USER_INFO,
                    });
                }).then(function(result) {
                     if (row.timestamp > Date.now()) {
                    next();
                } else {
                    res.status(403).json({
                        message: ob.objERRORS.TIMESTAMP_TIMEOUT,
                    });
                }
                })
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: ob.objERRORS.INVALID_TOKEN,
        });
    });
}
