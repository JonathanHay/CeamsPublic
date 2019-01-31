//academic-terms.js
var mongoose = require('mongoose');
var academicTermSchema = mongoose.Schema(
 {
 code: String,
 name: String,
measurements: [{type: mongoose.Schema.ObjectId, ref: ('Measurements')}]
 }
);
var AcademicTerms = mongoose.model("academic-term", academicTermSchema);
exports.Model = AcademicTerms