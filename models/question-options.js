//question-options.js
var mongoose            = require('mongoose');
var questionOptionsSchema = mongoose.Schema(
    {
        title: String,
        questionsBank: {type: mongoose.Schema.ObjectId, ref: ('QuestionsBanks')}
    }
)
var QuestionOptions = mongoose.model('question-option', questionOptionsSchema);
exports.model = QuestionOptions;