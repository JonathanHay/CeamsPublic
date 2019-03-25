//contentLevels.js
var mongoose = require('mongoose');
var contentLevelsSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        indicators: [{type: mongoose.Schema.ObjectId, ref: ('Indicators')}]
    }
);
var ContentLevels = mongoose.model('contentLevel', contentLevelsSchema);
exports.Model = ContentLevels;