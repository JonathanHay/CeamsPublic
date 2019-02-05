//departments.js
var mongoose = require('mongoose');
var departmentsSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        faculty: { type: mongoose.Schema.ObjectId, ref: ('Faculties') },
        program: [{ type: mongoose.Schema.ObjectId, ref: ('Programs') }]  
    }
);
var Departments = mongoose.model('department', departmentsSchema);
exports.Model = Departments;