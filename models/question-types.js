//question-types.js
var mongoose            = require('mongoose');
var questionTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        questionsBanks:[{type: mongoose.Schema.ObjectId, ref: ('QuestionsBanks')}]
    }
)
var QuestionTypes = mongoose.model('question-type', questionTypesSchema);
exports.model = QuestionTypes;