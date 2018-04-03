var express = require('express');
var Promise = require("bluebird");
var getSqlConnection = require("./databaseConnection");

exports.checkName = function checkDoubleName(data) {
    var sql = "SELECT nameuser, id FROM Human WHERE nameuser = ?";
    return returnPromise(sql, data.name);
}

exports.pushDataToDataBase = function insertData(data) {
    var people = {
        nameuser: data.name,
        surnameuser: data.surname,
        password: data.password,
        role: data.role,
        Birth_Date: data.birthday,
        Country: data.country,
        City: data.city,
        School: data.school,
        BIO: data.bio,
    };
    var sql = "INSERT INTO Human SET ?";
    return returnPromise(sql, people);
}

exports.updateDataInDataBase = function updateData(data, id) {
    var sql = "UPDATE Human SET ? WHERE id = " + id;
    var people = {
        nameuser: data.name,
        surnameuser: data.surname,
        password: data.password,
        role: data.role,
        Birth_Date: data.birthday,
        Country: data.country,
        City: data.city,
        School: data.school,
        BIO: data.bio,
    };
    return returnPromise(sql, people);
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
    var sql = "SELECT nameuser, surnameuser, password, Human.id, Birth_Date, BIO, Roles.name as role, Contries.name as country, Cities.name as city, Schools.name as school" +
        " FROM Human inner join Roles on Human.role = Roles.id inner join Contries on Human.Country = Contries.id" +
        " inner join Cities on Human.City = Cities.id inner join Schools on Human.School = Schools.id" +
        " where Human.id = ?";
    return returnPromise(sql, id);
}

exports.selectAllInformationDB = function selectInfoDB() {
    var sql = "SELECT nameuser, surnameuser, password, role, id, Birth_Date, Country, City, School, BIO FROM Human";
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

exports.selectRole = function selectRole() {
    var sql = "SELECT id, name FROM Roles";
    return returnPromise(sql);
}

exports.getContries = function getContries() {
    var sql = "SELECT id, name FROM Contries";
    return returnPromise(sql);
}

exports.getCity = function getCity(contry) {
    var sql = "SELECT id, Name FROM Cities WHERE Countries_id = ?";
    return returnPromise(sql, contry);
}

exports.getSchool = function getSchool(city) {
    var sql = "SELECT id, Name FROM Users.Schools inner JOIN Users.School_to_cities ON Schools.id = School_to_cities.School_id " +
        "WHERE Users.School_to_cities.Cities_id = ?";
    return returnPromise(sql, city);
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