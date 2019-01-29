var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  academicYear: String,
  term : String,
  course : String,
  duration : String,
  location : String,
  Instructor : String,
  testDate : Date,
  type: {type: mongoose.Schema.ObjectId, ref: 'DeliverableTypes'},
  question: [{type: mongoose.Schema.ObjectId, ref: 'Questions'}]
});

var test = mongoose.model('Test', testSchema);
exports.Model =  test;