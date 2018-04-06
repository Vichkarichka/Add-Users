var express = require('express');
var user = require('../Database/SqlQuery');
var ob = require('../Objecterror/objectError');
var admin = require('../Database/SqlQueryAdmin');

exports.checkContryForDataBase = function checkContryForDataBase(req, res, next) {

    var data = req.body;
    user.checkCountry(data).then(function(result) {
        if (result.length === 0) {
            return next();
        } else {
            res.status(409).json({
                message: ob.objERRORS.USER_COUNTRY,
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
}

exports.checkCityForDataBase = function checkCityForDataBase(req, res, next) {
    var data = req.body;
    user.checkCity(data).then(function(result) {
        console.log(result);
            if (result.length === 0) {
                 next();
            } else {
                res.status(409).json({
                    message: ob.objERRORS.USER_CITY,
                });
            }
    }).catch(function(error) {
        res.status(404).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
}

exports.checkSchoolForDataBase = function checkSchoolForDataBase(req, res, next) {
    var data = req.body;
    user.checkSchool(data).then(function(result) {
        console.log(result);
            if (result.length === 0) {
                 next();
            } else {
                res.status(409).json({
                    message: ob.objERRORS.USER_SCHOOL,
                });
            }
    }).catch(function(error) {
        res.status(404).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
}