//academic-year.js
var mongoose = require('mongoose');
var academicYearSchema = mongoose.Schema({
    code: String,
    name: String,
    instructor: [{type: mongoose.Schema.ObjectId, ref: ('Semester')}]
});
var AcademicYear= mongoose.model('AcademicRank', academicYearSchema);
exports.Model = AcademicYear;