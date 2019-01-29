var mongoose = require('mongoose');
var questionsSchema = mongoose.Schema(
    {   
        questionCode: String,
        questionText: String,
        questionOrder: Number,
        measuredIndicator: { type: mongoose.Schema.ObjectId, ref: ('MeasuredIndicator') },
        test: { type: mongoose.Schema.ObjectId, ref: ('Test') },
        questionGrade: [{ type: mongoose.Schema.ObjectId, ref: ('QuestionGrade') }]
    }
);
var Question = mongoose.model('question', questionsSchema);
exports.Model = Question;    