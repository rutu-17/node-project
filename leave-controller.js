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
    var leave_status = req.body.leave_status;
    connection.query('INSERT into employees_leaves SET reason = "'+ reason +'", start_date = "'+ start_date +'", end_date = "'+ end_date +'", leave_type_id = (SELECT id from leave_type where leave_name = "'+leave_type+'"), employee_id = (SELECT id from employees WHERE username = "'+employee+'"), requested_date = "'+ requested_at +'", leave_status = "'+ leave_status +'"',
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
