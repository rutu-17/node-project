/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var authenticateController = require('./controller/authenticate-controller');
var registerController = require('./controller/register-controller');
var leaveController = require('./controller/leave-controller');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req,res){
	res.setHeader('content-type', 'application/json');
  res.json({status: "ok", message: "You are in the root route"});
});

app.post('/api/register', registerController.register);
app.post('/api/authenticate', authenticateController.authenticate);
app.post('/api/appliedleaves', leaveController.leave);
app.get('/api/leaves_list', leaveController.leave_list);
app.listen(8000);


