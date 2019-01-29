//question-grades.js
var mongoose            = require('mongoose');
var questionGradesSchema = mongoose.Schema(
    {
        studentNumber: String,
        grade: String,
        CEABScoreMappingFormula: String,
        CEABScore: Number,
        question: {type: mongoose.Schema.ObjectId, ref: ('Questions')}
    }
)
var QuestionGrades = mongoose.model('question-grade', questionGradesSchema);
exports.model = QuestionGrades;