//departments.js
var mongoose = require('mongoose');
var departmentsSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        faculty: {type: mongoose.Schema.ObjectId, ref: ('Faculties')},
        programs: [{type: mongoose.Schema.ObjectId, ref: ('Programs')}]
    }
);
var Departments = mongoose.model('department', departmentsSchema);
exports.Model = Departments;