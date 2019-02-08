//course-learning-outcomes.js
var mongoose = require('mongoose');
var courseLearningOutcomesSchema = mongoose.Schema(
    {   
        title: String,
        description: String,
        course: { type: mongoose.Schema.ObjectId, ref: ('Courses') }
    }
);
var CourseLearningOutcomes = mongoose.model('course-learning-outcome', courseLearningOutcomesSchema);
exports.Model = CourseLearningOutcomes;