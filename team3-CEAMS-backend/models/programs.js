//programs.js
var mongoose = require('mongoose');
var programsSchema = mongoose.Schema(
    {
        title: String,
        questionOne: String,
        questionTwo: String,
        questionThree: String,
        answerOne: String,
        answerTwo: String,
        answerThree: String,
        programStatement: String,
        departments: [{type: mongoose.Schema.ObjectId, ref: ('Departments')}],
        director: {type: mongoose.Schema.ObjectId, ref: ('Instructors')}
    }
);
var Programs = mongoose.model('program', programsSchema);
exports.Model = Programs;