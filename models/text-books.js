var mongoose = require('mongoose');

var textBookSchema = mongoose.Schema({
  title: String,
  author: String,
  publishert: String,
  year: Date,
  number: Number,
  course: {type: mongoose.Schema.ObjectId, ref: 'Courses'}
});

var textBook = mongoose.model('TextBooks', textBookSchema);
exports.Model =  textBook;