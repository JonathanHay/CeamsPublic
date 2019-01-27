//questions-bank.js
var mongoose            = require('mongoose');
var questionsBanksSchema = mongoose.Schema(
    {
        code: String,
        text: String,
        frequencyPercent: Number,
        order: Number,
        courseNumber: String,
        courseTitle: String,
        authorNumber: String,
        authorName: String,
        questionType: {type: mongoose.Schema.ObjectId, ref: ('QuestionTypes')},
        questionOptions: [{type: mongoose.Schema.ObjectId, ref: ('QuestionOptions')}],
        questionGraphics: [{type: mongoose.Schema.ObjectId, ref: ('QuestionGraphics')}],
        topicsAssessed: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}]
    }
)
var QuestionsBanks = mongoose.model('questionsBank', questionsBanksSchema);
exports.model = QuestionsBanks;