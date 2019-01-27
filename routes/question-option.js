//question-option.js
var mongoose            = require('mongoose');
var questionOptionsSchema = mongoose.Schema(
    {
        title: String
    }
)
var QuestionOptions = mongoose.model('questionOption', questionOptionsSchema);
exports.model = QuestionOptions;