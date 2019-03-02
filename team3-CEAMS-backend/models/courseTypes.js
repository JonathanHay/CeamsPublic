//courseTypes.js
var mongoose = require('mongoose');
var courseTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
    }
);
var CourseTypes = mongoose.model('courseType', courseTypesSchema);
exports.Model = CourseTypes;