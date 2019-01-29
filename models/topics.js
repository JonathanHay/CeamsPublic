var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
  number: String,
  title: String,
  weekTaught: Number,
  notes: String,
  course: {type: mongoose.Schema.ObjectId, ref: 'Courses'},
  studentsGain: {type: mongoose.Schema.ObjectId, ref: 'Competencies'}
});

var topic = mongoose.model('Topics', topicSchema);
exports.Model =  topic;