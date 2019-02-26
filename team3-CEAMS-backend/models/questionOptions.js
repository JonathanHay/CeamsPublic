//questionOptions.js
var mongoose = require('mongoose');
var questionOptionsSchema = mongoose.Schema(
    {
        title: String,
        questionBank: {type: mongoose.Schema.ObjectId, ref: ('QuestionBank')}
    }
);
var QuestionOptions = mongoose.model('questionOption', questionOptionsSchema);
exports.Model = QuestionOptions;