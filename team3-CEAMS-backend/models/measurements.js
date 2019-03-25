//measurements.js
var mongoose = require('mongoose');
var measurementsSchema = mongoose.Schema(
    {
        courseNumber: String,
        courseTitle: String,
        instructorNumber: String,
        instructorName: String,
        weekNumber: Number,
        academicTerm: {type: mongoose.Schema.ObjectId, ref: ('AcademicTerms')},
        academicYear: {type: mongoose.Schema.ObjectId, ref: ('AcademicYears')},
        indicators: [{type: mongoose.Schema.ObjectId, ref: ('MeasuredIndicators')}]
    }
);
var Measurements = mongoose.model('measurement', measurementsSchema);
exports.Model = Measurements;