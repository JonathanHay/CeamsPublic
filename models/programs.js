var mongoose = require('mongoose');
var programsSchema = mongoose.Schema(
    {   
        questionOne: String,
        questionTwo: String,
        questionThree: String,
        answerOne: String,
        answerTwo: String,
        answerThree: String,
        programStatement: String,
        department: [{ type: mongoose.Schema.ObjectId, ref: ('Department') }],
        instructor: { type: mongoose.Schema.ObjectId, ref: ('Instructor') }
    }
);
var Program = mongoose.model('program', programsSchema);
exports.Model = Program;    