//deliverable-type.js
var mongoose = require('mongoose');
var deliverableTypeSchema = mongoose.Schema(
    {   
        code: String,
        string: String,
        test: [{ type: mongoose.Schema.ObjectId, ref: ('Test') }]    
    }
);
var DeliverableType = mongoose.model('DeliverableType', deliverableTypeSchema);
exports.Model = DeliverableType;