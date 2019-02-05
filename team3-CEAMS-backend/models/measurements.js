//measurements.js
var mongoose = require('mongoose');
var measurementSchema = mongoose.Schema(
{
coursesNumber: String,
courseTitle: String,
instructorNumber: String,
instructorName: String,
weekNumber: Integer,

 measuredindicator: [{type: mongoose.Schema.ObjectId, ref: ('MeasuredIndicators')}],

 //routes
 academicYear: {type: mongoose.Schema.ObjectId, ref:('AcademicYears')},
 academicTerm: {type: mongoose.Schema.ObjectId, ref: ("AcademicTerms")}
}

);
var Measurements = mongoose.model("measurement", measurementSchema);
exports.Model = Measurements