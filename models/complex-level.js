//complex-level.js
var mongoose = require('mongoose');
var complexLevelSchema = mongoose.Schema({
    level: [
        'Easy',
        'Medium',
        'Hard'
    ],
    topicsAssessed: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}]
});
var ComplexLevel= mongoose.model('ComplexLevel', complexLevelSchema);
exports.Model = ComplexLevel;