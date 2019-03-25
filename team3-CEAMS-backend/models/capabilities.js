//capabilities.js
var mongoose = require('mongoose');
var capabilitiesSchema = mongoose.Schema(
    {
        code: String,
        systemFeature: String,
        permissions: [{type: mongoose.Schema.ObjectId, ref: ('Permissions')}]
    }
);
var Capabilities = mongoose.model('capability', capabilitiesSchema);
exports.Model = Capabilities;