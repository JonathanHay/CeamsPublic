//roles.js
var mongoose    = require('mongoose');
var rolesSchema = mongoose.Schema(
    {
        name: String,
        permissions: [{type: mongoose.Schema.ObjectId, ref: ('Permissions')}],
        userRoles: [{type: mongoose.Schema.ObjectId, ref: ('UserGivenRoles')}],
    }
)
var Roles = mongoose.model('role', rolesSchema);
exports.model = Roles;