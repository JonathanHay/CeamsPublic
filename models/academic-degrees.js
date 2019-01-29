//academic-degrees.js
var mongoose = require('mongoose');
var academicDegreeSchema = mongoose.Schema({
    code: String,
    name: String,
    degreeProviders: [{type: mongoose.Schema.ObjectId, ref: ('DegreeProviders')}]
});
var AcademicDegrees = mongoose.model('academic-degree', academicDegreeSchema);
exports.Model = AcademicDegrees;