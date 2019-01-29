//questions-banks.js
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
        type: {type: mongoose.Schema.ObjectId, ref: ('QuestionTypes')},
        options: [{type: mongoose.Schema.ObjectId, ref: ('QuestionOptions')}],
        graphics: [{type: mongoose.Schema.ObjectId, ref: ('QuestionGraphics')}],
        topics: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}]
    }
)
var QuestionsBanks = mongoose.model('questionsBank', questionsBanksSchema);
exports.model = QuestionsBanks;