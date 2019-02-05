//content-levels.js
var mongoose = require('mongoose');
var contentLevelsSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        indicator: [{ type: mongoose.Schema.ObjectId, ref: ('Indicators') }]    
    }
);
var ContentLevels = mongoose.model('content-level', contentLevelsSchema);
exports.Model = ContentLevels;
