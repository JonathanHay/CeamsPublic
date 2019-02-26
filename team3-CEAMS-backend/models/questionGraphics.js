//questionGraphics.js
var mongoose = require('mongoose');
var questionGraphicsSchema = mongoose.Schema(
    {
        image: String,
        questionBank: {type: mongoose.Schema.ObjectId, ref: ('QuestionBank')}
    }
);
var QuestionGraphics = mongoose.model('questionGraphic', questionGraphicsSchema);
exports.Model = QuestionGraphics;