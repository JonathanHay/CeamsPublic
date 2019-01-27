//question-type.js
var mongoose            = require('mongoose');
var questionTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String
    }
)
var QuestionTypes = mongoose.model('questionType', questionTypesSchema);
exports.model = QuestionTypes;