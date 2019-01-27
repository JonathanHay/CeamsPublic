//course-type.js
var mongoose = require('mongoose');
var courseTypeSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        course: [{ type: mongoose.Schema.ObjectId, ref: ('Course') }]    
    }
);
var CourseType = mongoose.model('CourseType', courseTypeSchema);
exports.Model = CourseType;
