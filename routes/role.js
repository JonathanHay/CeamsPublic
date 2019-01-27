//role.js
var mongoose            = require('mongoose');
var rolesSchema = mongoose.Schema(
    {
        name: String,
        permission: [{type: mongoose.Schema.ObjectId, ref: ('Permissions')}],
        userGivenRole: [{type: mongoose.Schema.ObjectId, ref: ('UserGivenRoles')}],
    }
)
var Roles = mongoose.model('role', rolesSchema);
exports.model = Roles;