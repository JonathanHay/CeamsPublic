//capabilities.js
var mongoose = require('mongoose');
var capabilitysSchema = mongoose.Schema({
    code: String,
    systemFeature: String,
    permissions: [{type: mongoose.Schema.ObjectId, ref: ('Permissions')}]
});
var Capabilities= mongoose.model('capability', capabilitysSchema);
exports.Model = Capabilities;