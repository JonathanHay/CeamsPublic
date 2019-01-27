//department.js
var mongoose = require('mongoose');
var departmentSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        faculty: [{ type: mongoose.Schema.ObjectId, ref: ('Faculty') }],
        program: [{ type: mongoose.Schema.ObjectId, ref: ('Program') }]  
    }
);
var Department = mongoose.model('Department', departmentSchema);
exports.Model = Department;