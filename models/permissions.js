var mongoose = require('mongoose');
var permissionsSchema = mongoose.Schema(
    {   
        permission: Boolean,
        role: { type: mongoose.Schema.ObjectId, ref: ('Role') },
        capability: { type: mongoose.Schema.ObjectId, ref: ('Capability') }
    }
);
var Permission = mongoose.model('permission', permissionsSchema);
exports.Model = Permission;