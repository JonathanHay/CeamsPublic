//semesters.js
var mongoose = require('mongoose');
var semestersSchema = mongoose.Schema(
    {
        courseContact: Boolean,
        term: {type: mongoose.Schema.ObjectId, ref: ('AcademicTerms')},
        year: {type: mongoose.Schema.ObjectId, ref: ('AcademicYears')},
        course: {type: mongoose.Schema.ObjectId, ref: ('Courses')},
        instructor: {type: mongoose.Schema.ObjectId, ref: ('Instructors')}
    }
);
var Semesters = mongoose.model('semester', semestersSchema);
exports.Model = Semesters;