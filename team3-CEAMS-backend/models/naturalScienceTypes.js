//naturalScienceTypes.js
var mongoose = require('mongoose');
var naturalScienceTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
    }
);
var NaturalScienceTypes = mongoose.model('naturalScienceType', naturalScienceTypesSchema);
exports.Model = NaturalScienceTypes;