//question-graphics.js
var mongoose            = require('mongoose');
var questionGraphicsSchema = mongoose.Schema(
    {
        image: String
    }
)
var QuestionGraphics = mongoose.model('questionGraphic', questionGraphicsSchema);
exports.model = QuestionGraphics;