//content-level.js
var mongoose = require('mongoose');
var contentLevelSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        indicator: [{ type: mongoose.Schema.ObjectId, ref: ('Indicator') }]    
    }
);
var ContentLevel = mongoose.model('ContentLevel', contentLevelSchema);
exports.Model = ContentLevel;
