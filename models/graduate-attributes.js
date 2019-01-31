//graduate-attributes.js
var mongoose = require('mongoose');
var graduateAttributesSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        description: String,
        indicator: [{ type: mongoose.Schema.ObjectId, ref: ('Indicators') }],
    }
);
var GraduateAttributes = mongoose.model('graduate-attribute', graduateAttributesSchema);
exports.Model = GraduateAttributes;