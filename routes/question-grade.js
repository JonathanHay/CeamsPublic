//question-grade.js
var mongoose            = require('mongoose');
var questionGradeSchema = mongoose.Schema(
    {
        studentNumber: String,
        grade: String,
        CEABScoreMappingFormula: String,
        CEABScore: String,
        question: [{type: mongoose.Schema.ObjectId, ref: ('Questions')}]
    }
)
var QuestionGrades = mongoose.model('questionGrade', questionGradeSchema);
exports.model = QuestionGrades;