//permissions.js
var mongoose = require('mongoose');
var permissionsSchema = mongoose.Schema(
    {
        permission: Boolean,
        role: {type: mongoose.Schema.ObjectId, ref: ('Roles')},
        feature: {type: mongoose.Schema.ObjectId, ref: ('Capabilities')}
    }
);
var Permissions = mongoose.model('permission', permissionsSchema);
exports.Model = Permissions;