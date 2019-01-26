var mongoose = require('mongoose');
var programSchema = mongoose.Schema(
    {   
        questionOne: String,
        questionTwo: String,
        questionThree: String,
        answerOne: String,
        answerTwo: String,
        answerThree: String,
        programStatement: String,
        department: [{ type: mongoose.Schema.ObjectId, ref: ('Department') }],
        instructor: [{ type: mongoose.Schema.ObjectId, ref: ('Instructor') }]
    }
);
var Program = mongoose.model('Program', programSchema);
exports.Model = Program;    