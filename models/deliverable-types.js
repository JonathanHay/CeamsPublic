//deliverable-types.js
var mongoose = require('mongoose');
var deliverablesTypeSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        test: [{ type: mongoose.Schema.ObjectId, ref: ('Tests') }]    
    }
);
var DeliverableTypes = mongoose.model('deliverable-type', deliverableTypesSchema);
exports.Model = DeliverableTypes;