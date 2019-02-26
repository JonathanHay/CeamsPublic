//textBooks.js
var mongoose = require('mongoose');
var textBooksSchema = mongoose.Schema(
    {
        title: String,
        author: String,
        publisher: String,
        year: Date,
        number: Number,
        course: {type: mongoose.Schema.ObjectId, ref: ('Courses')}
    }
);
var TextBooks = mongoose.model('textBook', textBooksSchema);
exports.Model = TextBooks;