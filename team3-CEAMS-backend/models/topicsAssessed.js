//topicsAssessed.js
var mongoose = require('mongoose');
var topicsAssessedSchema = mongoose.Schema(
    {
        topicNumber: String,
        topicTitle: String,
        level: {type: mongoose.Schema.ObjectId, ref: ('ComplexLevels')},
        questionBank: {type: mongoose.Schema.ObjectId, ref: ('QuestionBank')}
    }
);
var TopicsAssessed = mongoose.model('topicsAssessed', topicsAssessedSchema);
exports.Model = TopicsAssessed;