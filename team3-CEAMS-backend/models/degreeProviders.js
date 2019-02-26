//degreeProviders.js
var mongoose = require('mongoose');
var degreeProvidersSchema = mongoose.Schema(
    {
        name: String,
        datedIssued: Date,
        degree: {type: mongoose.Schema.ObjectId, ref: ('AcademicDegrees')},
        instructor: {type: mongoose.Schema.ObjectId, ref: ('Instructors')}
    }
);
var DegreeProviders = mongoose.model('degreeProvider', degreeProvidersSchema);
exports.Model = DegreeProviders;