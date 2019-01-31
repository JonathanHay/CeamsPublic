//academic-years.js
var mongoose = require('mongoose');
var academicYearsSchema = mongoose.Schema({
    code: String,
    name: String,
    instructors: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}]
});
var AcademicYears= mongoose.model('academic-year', academicYearsSchema);
exports.Model = AcademicYears;