//capabilities.js
var mongoose = require('mongoose');
var capabilitySchema = mongoose.Schema({
    code: String,
    systemFeature: String,
    permission: [{type: mongoose.Schema.ObjectId, ref: ('Permissions')}]
});
var Capabilities= mongoose.model('capability', capabilitySchema);
exports.Model = Capabilities;