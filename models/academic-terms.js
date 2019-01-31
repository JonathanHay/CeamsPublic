//academic-terms.js
var mongoose = require('mongoose');
var academicTermsSchema = mongoose.Schema({
    code: String,
    name: String,
    semesters: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}]
});
var AcademicTerms= mongoose.model('academic-term', academicTermsSchema);
exports.Model = AcademicTerms;
