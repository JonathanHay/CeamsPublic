var mongoose = require('mongoose');

var userEvaluationMethodSchema = mongoose.Schema({
  formulaExpression: String,
  formulaDescription: String,
  timeToApply: Date,
  instructors: [{type: mongoose.Schema.ObjectId, ref: 'Instructors'}],
  staff: [{type: mongoose.Schema.ObjectId, ref: 'Staff'}]
});

var userEvaluationMethod = mongoose.model('UserEvaluationMethods', userEvaluationMethodSchema);
exports.Model =  userEvaluationMethod;