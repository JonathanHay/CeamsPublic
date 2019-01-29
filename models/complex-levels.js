//complex-levels.js
var mongoose = require('mongoose');
var complexLevelSchema = mongoose.Schema({
    level: [
        'Easy',
        'Medium',
        'Hard'
    ],
    topicsAssessed: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}]
});
var ComplexLevels= mongoose.model('complex-level', complexLevelSchema);
exports.Model = ComplexLevels;