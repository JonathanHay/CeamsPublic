//faculty.js
var mongoose = require('mongoose');
var facultySchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        department: [{ type: mongoose.Schema.ObjectId, ref: ('Department') }],
    }
);
var Faculty = mongoose.model('Department', facultySchema);
exports.Model = Faculty;