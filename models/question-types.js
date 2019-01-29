//question-types.js
var mongoose            = require('mongoose');
var questionTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        questionsBanks:[{type: mongoose.Schema.ObjectId, ref: ('QuestionsBanks')}]
    }
)
var QuestionTypes = mongoose.model('questionType', questionTypesSchema);
exports.model = QuestionTypes;