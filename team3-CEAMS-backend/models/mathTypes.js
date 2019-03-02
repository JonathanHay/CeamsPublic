//MathTypes.js
var mongoose = require('mongoose');
var mathTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
    }
);
var MathTypes = mongoose.model('mathType', mathTypesSchema);
exports.Model = MathTypes;