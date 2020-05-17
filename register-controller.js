/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var connection = require('./../config');

module.exports.register = function(req, res){
    var users = {
        "first_name" : req.body.first_name,
        "last_name" : req.body.last_name,
        "username" : req.body.username,
        "email" : req.body.email,
        "password" : req.body.password,
        "role" : req.body.role
    }
    
        
    connection.query('INSERT into employees SET first_name = "'+ users.first_name +'", last_name = "'+ users.last_name +'", username = "'+ users.username +'", email = "'+users.email+'", password = MD5("'+ users.password +'"), role = "'+users.role+'"', function(error, result, fields){
        console.log(error);
       if(error){
           res.json({
               status : false,
               message: "There is some error with the query"
           });
       } 
       else{
           res.json({
               status : true,
               data : result,
               message: "User registered successfully"
           });
       }
    });
}
