//question-option.js
var mongoose            = require('mongoose');
var questionOptionsSchema = mongoose.Schema(
    {
        title: String,
        questionsBank: {type: mongoose.Schema.ObjectId, ref: ('QuestionsBanks')}
    }
)
var QuestionOptions = mongoose.model('questionOption', questionOptionsSchema);
exports.model = QuestionOptions;