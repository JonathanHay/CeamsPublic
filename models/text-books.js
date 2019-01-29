var mongoose = require('mongoose');

var textBooksSchema = mongoose.Schema({
  title: String,
  author: String,
  publishert: String,
  year: Date,
  number: Number,
  course: {type: mongoose.Schema.ObjectId, ref: 'Courses'}
});

var textBooks = mongoose.model('TextBooks', textBooksSchema);
exports.Model =  textBooks;