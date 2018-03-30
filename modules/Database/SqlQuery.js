var express = require('express');
var Promise = require("bluebird");
var getSqlConnection = require("./databaseConnection");

exports.checkName = function checkDoubleName(data) {
    var sql = "SELECT nameuser, id FROM Human WHERE nameuser = ?";
    return returnPromise(sql, data.name);
}

exports.pushDataToDataBase = function insertData(name, surname, age, password, role) {
    var people = {
        nameuser: name,
        surnameuser: surname,
        age: age,
        password: password,
        role: role,
    };
    var sql = "INSERT INTO Human SET ?";
    return returnPromise(sql, people);
}

exports.updateDataInDataBase = function updateData(name, surname, age, password, role, id) {
    var sql = "UPDATE Human SET nameuser = ?, surnameuser = ?, age = ?, password = ?, role = ? WHERE id = ?";
    var dataPersons = [name, surname, age, password, role, id];
    return returnPromise(sql, dataPersons);
}

exports.loginUserIntoApp = function loginData(data) {
    var sql = "SELECT nameuser, password, role, id FROM Human WHERE nameuser = ? AND password = ?";
    var dataForLogin = [data.name, data.password];
    return returnPromise(sql, dataForLogin);
}

exports.findTokenInDataBase = function findToken(row) {
    var sql = "SELECT Userid, token, timestamp FROM LoginUsershash WHERE Userid  = ?";
    return returnPromise(sql, row.id);
}

exports.insertTokenInDataBase = function insertToken(row, tokenForLogin, timestampForLogin) {
    var dataForToken = {
        Userid: row.id,
        token: tokenForLogin,
        timestamp: timestampForLogin,
    };
    var sql = "INSERT INTO LoginUsershash SET ? ";
    return returnPromise(sql, dataForToken);
}

exports.updateTokenInDataBase = function updateToken(row, tokenForLogin, timestampForLogin) {
    var sql = "UPDATE LoginUsershash SET  token = ?, timestamp = ? WHERE Userid = ?";
    var dataToken = [tokenForLogin, timestampForLogin, row.id];
    return returnPromise(sql, dataToken);
}

exports.selectAllInformation = function selectInfo(id) {
    var sql = "SELECT nameuser, surnameuser, age, password, role, id FROM Human WHERE id = ?";
    return returnPromise(sql, id);
}

exports.selectAllInformationDB = function selectInfoDB() {
    var sql = "SELECT nameuser, surnameuser, age, password, role, id FROM Human";
    return returnPromise(sql);
}

exports.checkToken = function checkTokenDB(headerHash) {
    var sql = "SELECT Userid, token, timestamp FROM LoginUsershash WHERE token = ?";
    return returnPromise(sql, headerHash);
}

exports.checkRoleIntoDataBase = function checkRole(id) {
    var sql = "SELECT role, id FROM Human WHERE id = ?";
    return returnPromise(sql, id);
}

exports.deletePersonOfDataBase = function deletePerson(id) {
    var sql = "DELETE FROM Human WHERE id = ?";
    return returnPromise(sql, id);
}

function returnPromise(sql, dataForDB) {
    return Promise.using(getSqlConnection(), function(connection) {
        return connection.query(sql, dataForDB).then(function(rows) {
            return rows;
        }).catch(function(error) {
            console.log(error);
        });
    });
}