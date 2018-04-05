var express = require('express');

var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var ob = require('../Objecterror/objectError');

exports.validationFieldSignUp = function validationFieldSignUp(req, res, next) {
    req.checkBody('name', ob.objERRORS.USER_NAME).notEmpty().isAlpha();
    req.checkBody('surname', ob.objERRORS.USER_SURNAME).notEmpty().isAlpha();
    req.checkBody('password', ob.objERRORS.USER_PASSWORD).notEmpty().isLength({
        min: 5
    });
    req.checkBody('role', ob.objERRORS.USER_SELECT).notEmpty().isNumeric();
    req.checkBody('birthday', ob.objERRORS.USER_AGE).notEmpty();
    req.checkBody('country', ob.objERRORS.USER_SELECT).isNumeric();
    req.checkBody('city', ob.objERRORS.USER_SELECT).isNumeric();
    req.checkBody('school', ob.objERRORS.USER_SELECT).isNumeric();
    req.checkBody('bio', ob.objERRORS.USER_BIO).notEmpty().isAlpha();
    errors(req, res, next);
}

exports.validationFieldCountry = function validationFieldCountry(req, res, next) {
    req.checkBody('name', ob.objERRORS.USER_NAME).notEmpty().isAlpha();
    errors(req, res, next);
}

exports.validationFieldSchool = function validationFieldSchool(req, res, next) {
    req.checkBody('name', ob.objERRORS.USER_NAME).notEmpty().isNumeric();
    errors(req, res, next);
}

exports.validationFieldCity = function validationFieldCity(req, res, next) {
    req.checkBody('name', ob.objERRORS.USER_NAME).notEmpty().isAlpha();
    req.checkBody('countryName', ob.objERRORS.USER_SELECT).isNumeric();
    errors(req, res, next);
}

function errors(req, res, next) {
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
}