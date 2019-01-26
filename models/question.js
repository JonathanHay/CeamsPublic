var mongoose = require('mongoose');
var questionSchema = mongoose.Schema(
    {   
        questionCode: String,
        questionText: String,
        questionOrder: Number,
        measuredIndicator: [{ type: mongoose.Schema.ObjectId, ref: ('MeasuredIndicator') }],
        test: [{ type: mongoose.Schema.ObjectId, ref: ('Test') }],
        questionGrade: [{ type: mongoose.Schema.ObjectId, ref: ('QuestionGrade') }]
    }
);
var Question = mongoose.model('Question', questionSchema);
exports.Model = Question;    