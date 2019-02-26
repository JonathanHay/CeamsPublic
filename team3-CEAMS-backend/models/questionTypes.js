//questionTypes.js
var mongoose = require('mongoose');
var questionTypesSchema = mongoose.Schema(
    {
        name: String,
        questionBanks: [{type: mongoose.Schema.ObjectId, ref: ('QuestionBanks')}]
    }
);
var QuestionTypes = mongoose.model('questionType', questionTypesSchema);
exports.Model = QuestionTypes;