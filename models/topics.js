var mongoose = require('mongoose');

var topicsSchema = mongoose.Schema({
  number: String,
  title: String,
  weekTaught: Number,
  notes: String,
  course: {type: mongoose.Schema.ObjectId, ref: 'Courses'},
  studentsGain: {type: mongoose.Schema.ObjectId, ref: 'Competencies'}
});

var topics = mongoose.model('Topics', topicsSchema);
exports.Model =  topics;