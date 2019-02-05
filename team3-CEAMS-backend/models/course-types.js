//course-types.js
var mongoose = require('mongoose');
var courseTypesSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        course: [{ type: mongoose.Schema.ObjectId, ref: ('Courses') }]    
    }
);
var CourseTypes = mongoose.model('course-type', courseTypesSchema);
exports.Model = CourseTypes;
