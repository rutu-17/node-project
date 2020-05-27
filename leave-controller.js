/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var connection = require('./../config');

function Leave(reason, start_date, end_date, requested_by, leave_type) {
  this.reason = reason;
  this.start_date = start_date;
  this.end_date = end_date;
  this.requested_by = requested_by;
  this.leave_type = leave_type;
}

module.exports.leave = function(req, res){
    res.setHeader('content-type', 'application/json');
    
    var reason = req.body.reason;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var leave_type = req.body.leave_type;
    var employee = req.body.username;

    var requested_at = req.body.requested_date;
//    var leave_status = req.body.leave_status;
    connection.query('INSERT into employees_leaves SET reason = "'+ reason +'", start_date = "'+ start_date +'", end_date = "'+ end_date +'", leave_type_id = (SELECT id from leave_type where leave_name = "'+leave_type+'"), employee_id = (SELECT id from employees WHERE username = "'+employee+'"), requested_date = "'+ requested_at +'", leave_status = "Pending"',
        function(err, result, fields){
            console.log(err);
            if (err) {
                res.json({status:false, inserted: 'NULL', message: err 
                });
            } else {
                res.json({status:true, inserted: result, message: 'Successfully Leave Applied' });
            }
        }
    );
};

//list of applied leaves by all the employees
module.exports.leave_list = function (req, res) {
    res.setHeader('content-type', 'application/json');
    connection.query('SELECT id, reason, start_date, end_date, leave_type_id as leave_type, employee_id as employee from employees_leaves',
            function (err, result, fields) {
                console.log(err);
                if (err) {
                    res.json({status: false, inserted: 'NULL', message: err
                    });
                } else {
                    res.json({status: true, data: result, message: 'List of leaves applied'});
                }
            }
    );

};

//list of applied leaves by a particular employee
module.exports.leave_applied_by_id = function (req, res) {
    res.setHeader('content-type', 'application/json');
    connection.query('SELECT employees_leaves.reason, DATE_FORMAT(start_date,\'%Y-%m-%d\') as start_date, DATE_FORMAT(end_date,\'%Y-%m-%d\') as end_date, employees_leaves.employee_id, leave_type.leave_name, employees.username from employees_leaves INNER JOIN leave_type ON leave_type.id = employees_leaves.leave_type_id INNER JOIN employees ON employees.id = employees_leaves.employee_id WHERE employee_id = ?', req.params.id,
            function (err, result, fields) {
                console.log(err);
//                if (err) {
//                    res.json({status: false, inserted: 'NULL', message: err
//                    });
//                }
            if(result.length > 0){
                if(req.params.id == result[0].employee_id){
                    res.json({status: true, data: result, message: 'List of leaves applied'});
                 }   
            }
            else{
                res.json({status: false, message: 'No leaves applied by this employee'});
            }
        }        
    );

};

module.exports.update_leave_status = function(req, res){
    res.setHeader('content-type', 'application/json');
        connection.query('SELECT employees_leaves.reason, DATE_FORMAT(start_date,\'%Y-%m-%d\') as start_date, DATE_FORMAT(end_date,\'%Y-%m-%d\') as end_date, employees_leaves.employee_id, leave_type.leave_name, leave_type.allowed_leave, employees.username from employees_leaves INNER JOIN leave_type ON leave_type.id = employees_leaves.leave_type_id INNER JOIN employees ON employees.id = employees_leaves.employee_id WHERE employee_id = ?', req.params.id, function (err, result, fields){
                if(req.params.id == result[0].employee_id){
                    console.log(result[0].end_date);
                    var obj = [];
                    for (var i = 0; i < result.length; i++) {
                        var start_date = new Date(result[i].start_date);
                        var end_date = new Date(result[i].end_date);
                        var diffTime = Math.abs(start_date.getTime() - end_date.getTime());
                        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        result[i]["days_applied"] = diffDays + 1;
                        var leave_balance = result[i].allowed_leave - result[i].days_applied;
                        result[i]["leave_balance"] = leave_balance;
                    }
                    
                   
                    if(result[0].leave_balance <= result[0].allowed_leave){
                            connection.query('UPDATE employees, employees_leaves SET leave_balance_casual = "'+leave_balance+'", leave_status = "Approved" WHERE employees_leaves.employee_id = "'+req.params.id+'" AND employees.id = "'+req.params.id+'"', function (err, result_update, fields){
                                if (err) {
                                    res.json({status: false, message: err
                                    });
                                } else {
                                    res.json({status: true, data : result, message: 'Successfully saved.'});
                                }
                            });   
                    }
                    else{
                        connection.query('UPDATE employees, employees_leaves SET leave_status = "Rejected" WHERE id = ?', req.params.id, function (err, result_update, fields){
                                if (err) {
                                    res.json({status: false, message: err
                                    });
                                } else {
                                    res.json({status: true, data : result, message: 'Successfully saved.'});
                                }
                            });  
                    }
                   
                }
                else{
                    res.json({status: false, message: 'No leaves applied by this employee'});
                }
        });
};
