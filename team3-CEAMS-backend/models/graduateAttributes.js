//graduateAttributes.js
var mongoose = require('mongoose');
var graduateAttributesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        description: String,
        indicators: [{type: mongoose.Schema.ObjectId, ref: ('Indicators')}]
    }
);
var GraduateAttributes = mongoose.model('graduateAttribute', graduateAttributesSchema);
exports.Model = GraduateAttributes;