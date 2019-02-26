//academicTerms.js
var mongoose = require('mongoose');
var academicTermsSchema = mongoose.Schema(
    {
        name: String,
        measurements: [{type: mongoose.Schema.ObjectId, ref: ('Measurements')}],
        semesters: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}]
    }
);
var AcademicTerms = mongoose.model('academicTerm', academicTermsSchema);
exports.Model = AcademicTerms;