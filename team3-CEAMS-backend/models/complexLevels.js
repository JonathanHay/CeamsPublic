//complexLevels.js
var mongoose = require('mongoose');
var complexLevelsSchema = mongoose.Schema(
    {
        level: String,//Need to add in  = {'Easy', 'Medium', 'Hard'}
        topicsAssessed: [{type: mongoose.Schema.ObjectId, ref: ('TopicsAssessed')}]
    }
);
var ComplexLevels = mongoose.model('complexLevel', complexLevelsSchema);
exports.Model = ComplexLevels;