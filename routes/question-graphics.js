//question-graphics.js
var mongoose            = require('mongoose');
var questionGraphicsSchema = mongoose.Schema(
    {
        image: String,
        questionsBank: {type: mongoose.Schema.ObjectId, ref: ('QuestionsBanks')}
    }
)
var QuestionGraphics = mongoose.model('questionGraphic', questionGraphicsSchema);
exports.model = QuestionGraphics;