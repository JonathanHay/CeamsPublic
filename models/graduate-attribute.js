//graduate-attribute.js
var mongoose = require('mongoose');
var graduateAttributeSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        description: String,
        indicator: [{ type: mongoose.Schema.ObjectId, ref: ('Indicator') }],
    }
);
var GraduateAttribute = mongoose.model('GraduateAttribute', graduateAttributeSchema);
exports.Model = GraduateAttribute;