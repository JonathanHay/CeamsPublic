var mongoose = require('mongoose');
var naturalScienceTypesSchema = mongoose.Schema(
    {   
        name: String,
        code: String,
        Course: [{ type: mongoose.Schema.ObjectId, ref: ('Course') }]
    }
);
var NaturalScienceType = mongoose.model('natural-science-type', naturalScienceTypesSchema);
exports.Model = NaturalScienceType;