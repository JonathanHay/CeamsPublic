//questions.js
var mongoose = require('mongoose');
var questionsSchema = mongoose.Schema(
    {
        questionCode: String,
        questionText: String,
        questionOrder: Number,
        goodAnswerSample: String,
        averageAnswerSample: String,
        poorAnswerSample: String,
        measuredIndicator: {type: mongoose.Schema.ObjectId, ref: ('MeasuredIndicators')},
        test: {type: mongoose.Schema.ObjectId, ref: ('Tests')},
        questionGrades: [{type: mongoose.Schema.ObjectId, ref: ('QuestionGrades')}]
    }
);
var Questions = mongoose.model('question', questionsSchema);
exports.Model = Questions;