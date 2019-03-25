//licenceStatuses.js
var mongoose = require('mongoose');
var licenceStatusesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        licenceProviders: [{type: mongoose.Schema.ObjectId, ref: ('LicenceProviders')}]
    }
);
var LicenceStatuses = mongoose.model('licenceStatus', licenceStatusesSchema);
exports.Model = LicenceStatuses;