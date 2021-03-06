//userGivenRoles.js
var mongoose = require('mongoose');
var userGivenRolesSchema = mongoose.Schema(
    {
        dateAssigned: Date,
        role: {type: mongoose.Schema.ObjectId, ref: ('Roles')},
        user: {type: mongoose.Schema.ObjectId, ref: ('UserAccounts')}
    }
);
var UserGivenRoles = mongoose.model('userGivenRole', userGivenRolesSchema);
exports.Model = UserGivenRoles;