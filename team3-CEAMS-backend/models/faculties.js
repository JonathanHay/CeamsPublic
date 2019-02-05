//faculties.js
var mongoose = require('mongoose');
var facultiesSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        department: [{ type: mongoose.Schema.ObjectId, ref: ('Departments') }],
    }
);
var Faculties = mongoose.model('faculty', facultiesSchema);
exports.Model = Faculties;