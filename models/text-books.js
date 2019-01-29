var mongoose = require('mongoose');

var textBooksSchema = mongoose.Schema({
  title: String,
  author: String,
  publishert: String,
  year: Date,
  number: Number,
  course: {type: mongoose.Schema.ObjectId, ref: 'Courses'}
});

var TextBooks = mongoose.model('text-book', textBooksSchema);
exports.Model = TextBooks;