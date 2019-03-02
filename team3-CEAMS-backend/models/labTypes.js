//labTypes.js
var mongoose = require('mongoose');
var labTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
    }
);
var LabTypes = mongoose.model('labType', labTypesSchema, 'labTypes');
exports.Model = LabTypes;