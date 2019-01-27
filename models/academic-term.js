//academic-term.js
var mongoose = require('mongoose');
var academicTermSchema = mongoose.Schema({
    code: String,
    name: String,
    semester: [{type: mongoose.Schema.ObjectId, ref: ('Semester')}]
});
var AcademicTerm= mongoose.model('AcademicTerm', academicTermSchema);
exports.Model = AcademicTerm;