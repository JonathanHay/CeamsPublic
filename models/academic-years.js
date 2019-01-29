//academic-years.js
var mongoose = require('mongoose');
var academicYearSchema = mongoose.Schema({
    code: String,
    name: String,
    instructor: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}]
});
var AcademicYears= mongoose.model('academic-year', academicYearSchema);
exports.Model = AcademicYears;