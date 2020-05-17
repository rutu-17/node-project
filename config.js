/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
   host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hrms' 
});

connection.connect(function (err) {
    if (!err) {
        console.log("HRMS Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});

module.exports = connection;
