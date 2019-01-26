var mongoose = require('mongoose');
var permissionSchema = mongoose.Schema(
    {   
        permission: Boolean,
        role: [{ type: mongoose.Schema.ObjectId, ref: ('Role') }],
        capability: [{ type: mongoose.Schema.ObjectId, ref: ('Capability') }]
    }
);
var Permission = mongoose.model('Permission', permissionSchema);
exports.Model = Permission;