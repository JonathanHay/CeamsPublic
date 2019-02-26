//licenceProviders.js
var mongoose = require('mongoose');
var licenceProvidersSchema = mongoose.Schema(
    {
        name: String,
        dateIssued: Date,
        licenceStatus: {type: mongoose.Schema.ObjectId, ref: ('LicenceStatuses')},
        instructor: {type: mongoose.Schema.ObjectId, ref: ('Instructors')}
    }
);
var LicenceProviders = mongoose.model('licenceProvider', licenceProvidersSchema);
exports.Model = LicenceProviders;