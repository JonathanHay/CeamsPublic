var mongoose = require('mongoose');

var topicsAssessedsSchema = mongoose.Schema({
  topicNumber: String,
  topicTitle: String,
  questionsBank:  {type: mongoose.Schema.ObjectId, ref: 'QuestionBanks'},
  level: {type: mongoose.Schema.ObjectId, ref: 'ComplexLevels'}
});

var topicsAssesseds = mongoose.model('TopicsAssessed', topicsAssessedsSchema);
exports.Model =  topicsAssesseds;