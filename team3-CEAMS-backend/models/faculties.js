//faculties.js
var mongoose = require('mongoose');
var facultiesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        departments: [{type: mongoose.Schema.ObjectId, ref: ('Departments')}],
        university: {type: mongoose.Schema.ObjectId, ref: ('Universities')}
    }
);
var Faculties = mongoose.model('faculty', facultiesSchema);
exports.Model = Faculties;