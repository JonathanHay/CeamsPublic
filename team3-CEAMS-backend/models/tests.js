var mongoose = require('mongoose');

var testsSchema = mongoose.Schema({
  academicYear: String,
  term : String,
  course : String,
  duration : String,
  location : String,
  Instructor : String,
  testDate : Date,
  type: {type: mongoose.Schema.ObjectId, ref: 'DeliverableTypes'},
  questions: [{type: mongoose.Schema.ObjectId, ref: 'Questions'}]
});

var Tests = mongoose.model('test', testsSchema);
exports.Model = Tests;