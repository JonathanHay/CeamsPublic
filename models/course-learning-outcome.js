//course-learning-outcome.js
var mongoose = require('mongoose');
var courseLearningOutcomeSchema = mongoose.Schema(
    {   
        title: String,
        description: String,
        course: [{ type: mongoose.Schema.ObjectId, ref: ('Course') }]    
    }
);
var CourseLearningOutcome = mongoose.model('CourseLearningOutcome', courseLearningOutcomeSchema);
exports.Model = CourseLearningOutcome;
