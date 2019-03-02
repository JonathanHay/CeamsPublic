//userEvaluationMethods.js
var mongoose = require('mongoose');
var userEvaluationMethodsSchema = mongoose.Schema(
    {
        formulaExpression: String,
        formulaDescription: String,
        timeToApply: Date,
        instructors: [{type: mongoose.Schema.ObjectId, ref: ('Instructors')}],
        staff: [{type: mongoose.Schema.ObjectId, ref: ('Staff')}]
    }
);
var UserEvaluationMethods = mongoose.model('userEvaluationMethod', userEvaluationMethodsSchema);
exports.Model = UserEvaluationMethods;