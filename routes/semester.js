//semester.js
var mongoose            = require('mongoose');
var semestersSchema = mongoose.Schema(
    {
        courseContact: String,
        course: {type: mongoose.Schema.ObjectId, ref: ('Courses')},
        academicYear: {type: mongoose.Schema.ObjectId, ref: ('AcademicYears')},
        academicTerm: {type: mongoose.Schema.ObjectId, ref: ('AcademicTerms')},
        instructor: {type: mongoose.Schema.ObjectId, ref: ('Instructors')}
    }
)
var Semesters = mongoose.model('semester', semestersSchema);
exports.model = Semesters;