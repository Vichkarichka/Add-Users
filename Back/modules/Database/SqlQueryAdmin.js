var express = require('express');
var Promise = require("bluebird");
var getSqlConnection = require("./databaseConnection");

exports.insertNewCountry = function insertNewCountry(data) {
    var country = {
        Name: data.name,
    };
    var sql = "INSERT INTO Contries SET ?";
    return returnPromise(sql, country);
}
exports.deleteCountryOfDataBase = function deleteCountryOfDataBase(id) {
    var sql = "DELETE FROM Contries WHERE id = ?";
    return returnPromise(sql, id);
}

exports.updateCountry = function updateCountry(data, id) {
    var sql = "UPDATE Contries SET  Name = ? WHERE id = ?";
    var dataCountry = [data.name, id];
    return returnPromise(sql, dataCountry);
}

exports.getNameCountry = function getNameCountry(id) {
    var sql = "SELECT Name FROM Contries WHERE id = ?";
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