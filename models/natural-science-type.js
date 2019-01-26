var mongoose = require('mongoose');
var naturalScienceTypeSchema = mongoose.Schema(
    {   
        name: String,
        code: String,
        Course: [{ type: mongoose.Schema.ObjectId, ref: ('Course') }]
    }
);
var NaturalScienceType = mongoose.model('NaturalScienceType', naturalScienceTypeSchema);
exports.Model = NaturalScienceType;