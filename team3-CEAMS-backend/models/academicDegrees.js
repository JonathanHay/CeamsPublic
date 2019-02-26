//academicDegrees.js
var mongoose = require('mongoose');
var academicDegreesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        degreeProviders: [{type: mongoose.Schema.ObjectId, ref: ('DegreeProviders')}]
    }
);
var AcademicDegrees = mongoose.model('academicDegree', academicDegreesSchema);
exports.Model = AcademicDegrees;