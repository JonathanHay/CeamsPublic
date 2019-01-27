//capability.js
var mongoose = require('mongoose');
var capabilitySchema = mongoose.Schema({
    code: String,
    systemFeature: String,
    permission: [{type: mongoose.Schema.ObjectId, ref: ('Permission')}]
});
var Capability= mongoose.model('Capability', capabilitySchema);
exports.Model = Capability;