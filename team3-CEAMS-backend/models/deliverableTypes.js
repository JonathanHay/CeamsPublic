//deliverableTypes.js
var mongoose = require('mongoose');
var deliverableTypesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        tests: [{type: mongoose.Schema.ObjectId, ref: ('Tests')}],
    }
);
var DeliverableTypes = mongoose.model('deliverableType', deliverableTypesSchema);
exports.Model = DeliverableTypes;