//complex-levels.js
var mongoose = require('mongoose');
var complexLevelsSchema = mongoose.Schema({
    level: [
        'Easy',
        'Medium',
        'Hard'
    ],
    topicsAssessed: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}]
});
var ComplexLevels= mongoose.model('complex-level', complexLevelsSchema);
exports.Model = ComplexLevels;