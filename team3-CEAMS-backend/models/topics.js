//topics.js
var mongoose = require('mongoose');
var topicsSchema = mongoose.Schema(
    {
        number: String,
        title: String,
        weekTaught: Integer,
        notes: String,
        course: {type: mongoose.Schema.ObjectId, ref: ('Courses')},
        studentsGain: [{type: mongoose.Schema.ObjectId, ref: ('Competences')}]
    }
);
var Topics = mongoose.model('topic', topicsSchema);
exports.Model = Topics;