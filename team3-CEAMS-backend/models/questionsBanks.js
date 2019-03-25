//questionBanks.js
var mongoose = require('mongoose');
var questionBanksSchema = mongoose.Schema(
    {
        code: String,
        text: String,
        frequencyPercent: Number,
        order: Number,
        courseNumber: String,
        courseTitle: String,
        authorNumber: String,
        authorName: String,
        topics: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}],
        images: [{type: mongoose.Schema.ObjectId, ref: ('QuestionGraphics')}],
        options: [{type: mongoose.Schema.ObjectId, ref: ('QuestionOptions')}],
        type: {type: mongoose.Schema.ObjectId, ref: ('QuestionTypes')}
    }
);
var QuestionBanks = mongoose.model('questionBank', questionBanksSchema);
exports.Model = QuestionBanks;