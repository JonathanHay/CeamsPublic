//deliverable-types.js
var mongoose = require('mongoose');
var deliverableTypeSchema = mongoose.Schema(
 {
 code: String,
 name: String,
tests: [{type: mongoose.Schema.ObjectId, ref: ('Tests')}]
 }
);
var DeliverableTypes = mongoose.model("deliverable-type", deliverableTypeSchema);
exports.Model = DeliverableTypes