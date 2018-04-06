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

exports.getCities = function getCities() {
    var sql = "SELECT Cities.id as id, Cities.Name as Name, Contries.name as country, Contries.id as countryId" +
        " FROM Cities inner join Contries on Cities.Countries_id = Contries.id";
    return returnPromise(sql);
}

exports.insertNewCity = function insertNewCity(data) {
    var city = {
        Name: data.name,
        Countries_id: data.countryName,
    };
    var sql = "INSERT INTO Cities SET ?";
    return returnPromise(sql, city);
}

exports.deleteCityOfDataBase = function deleteCityOfDataBase(id) {
    var sql = "DELETE FROM Cities WHERE id = ?";
    return returnPromise(sql, id);
}

exports.getNameCity = function getNameCity(id) {
    var sql = "SELECT Name FROM Cities WHERE id = ?";
    return returnPromise(sql, id);
}

exports.updateCity = function updateCity(data, id) {
    var city = {
        Name: data.name,
        Countries_id: data.countryName,
    };
    var sql = "UPDATE Cities SET ? WHERE id = " + id;
    return returnPromise(sql, city);
}

exports.getSchools = function getSchools() {
    var sql = "SELECT Schools.id as id, Schools.Name as Name, Cities.Name as City, Cities.id as CityId, Contries.Name as Country" +
        " FROM Schools inner join School_to_cities on Schools.id = School_to_cities.School_id " +
        " inner join Cities on School_to_cities.Cities_id = Cities.id" +
        " inner join Contries on Contries.id = Cities.Countries_id";
    return returnPromise(sql);
}

exports.insertNewSchool = function insertNewSchool(data) {
    var schools = {
        Name: data.name,
    };
    var sql = "INSERT INTO Schools SET ?";
    return returnPromise(sql, schools);
}

exports.insertSchoolToCities = function insertSchoolToCities(data, id) {
    var schools = {
        School_id: id,
        Cities_id: data.cityName,
    };
    var sql = "INSERT INTO School_to_cities SET ?";
    return returnPromise(sql, schools);
}

exports.deleteSchoolOfDataBase = function deleteSchoolOfDataBase(id, cityId) {
    var sql = "DELETE FROM School_to_cities WHERE School_id = " + id + " and Cities_id =" + cityId;
    return returnPromise(sql);
}

exports.getNameSchool = function getNameSchool(id, cityId) {
    var sql = "SELECT Schools.Name as Name, School_to_cities.School_id" +
        " FROM Schools left outer join School_to_cities on School_to_cities.School_id = Schools.id where" +
        " (School_id = " + id + " and Cities_id =" + cityId + ")";
    return returnPromise(sql);
}

exports.updateSchool = function updateSchool(data, id) {
    var school = {
        Name: data.name,
    };
    var sql = "UPDATE Schools SET ? WHERE id = " + id;
    return returnPromise(sql, school);
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