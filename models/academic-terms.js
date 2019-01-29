//academic-terms.js
var mongoose = require('mongoose');
var academicTermSchema = mongoose.Schema({
    code: String,
    name: String,
    semester: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}]
});
var AcademicTerms= mongoose.model('academic-term', academicTermSchema);
exports.Model = AcademicTerms;