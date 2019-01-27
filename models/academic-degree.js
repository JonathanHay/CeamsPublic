//academic-degree.js
var mongoose = require('mongoose');
var academicDegreeSchema = mongoose.Schema({
    code: String,
    name: String,
    instructor: [{type: mongoose.Schema.ObjectId, ref: ('Instructor')}]
});
var AcademicDegree = mongoose.model('AcademicDegree', academicDegreeSchema);
exports.Model = AcademicDegree;