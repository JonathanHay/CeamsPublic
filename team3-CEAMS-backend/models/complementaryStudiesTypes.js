//complementaryStudiesTypes.js
var mongoose = require('mongoose');
var complementaryStudiesTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
    }
);
var ComplementaryStudiesTypes = mongoose.model('complementaryStudiesType', complementaryStudiesTypesSchema, 'ComplementaryStudiesTypes');
exports.Model = ComplementaryStudiesTypes;