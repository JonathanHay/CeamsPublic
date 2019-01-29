var mongoose = require('mongoose');

var topicsAssessedSchema = mongoose.Schema({
  topicNumber: String,
  topicTitle: String,
  questionsBank:  {type: mongoose.Schema.ObjectId, ref: 'QuestionBanks'},
  level: {type: mongoose.Schema.ObjectId, ref: 'ComplexLevels'}
});

var TopicsAssessed = mongoose.model('topics-assessed', topicsAssessedSchema);
exports.Model = TopicsAssessed;