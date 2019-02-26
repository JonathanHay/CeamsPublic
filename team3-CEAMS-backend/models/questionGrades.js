//questionGrades.js
var mongoose = require('mongoose');
var questionGradesSchema = mongoose.Schema(
    {
        studentNumber: String,
        grade: Number,
        CEABScoreMappingFormula: String,
        CEABScore: Number,
        question: {type: mongoose.Schema.ObjectId, ref: ('Questions')}
    }
);
var QuestionGrades = mongoose.model('questionGrade', questionGradesSchema);
exports.Model = QuestionGrades;