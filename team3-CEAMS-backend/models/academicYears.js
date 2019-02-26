//academicYears.js
var mongoose = require('mongoose');
var academicYearsSchema = mongoose.Schema(
    {
        name: String,
        measurements: [{type: mongoose.Schema.ObjectId, ref: ('Measurements')}],
        semesters: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}]
    }
);
var AcademicYears = mongoose.model('academicYear', academicYearsSchema);
exports.Model = AcademicYears;