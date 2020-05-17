/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var connection = require('./../config');
var md5 = require('md5');
module.exports.authenticate = function(req, res){
    var email=req.body.email;
    var password= req.body.password;
    connection.query('SELECT * from employees where email = "'+email+'"', function(error, result, fields){
        
       if(error){
           res.json({
               status : false,
               message: "There is some error with the query"
           });
       } 
       else{
           if(result.length >0){
               if(md5(password) == result[0].password){
                   res.json({
                    status:true,
                    message:'successfully authenticated'
                    });
               }
               else{
                   res.json({
                    status:false,
                    message:'Email and password does not match'
                    });
               }
           }
           else{
               res.json({
                    status:false,
                    message:'Email does not exist'
                    });
           }
       }
    });
}

