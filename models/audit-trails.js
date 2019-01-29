//audit-trails.js
var mongoose = require('mongoose');
var auditTrailSchema = mongoose.Schema({
    timeStamp: Date,
    authorUserName: String,
    actionDesc: String,
    changeFrom: String,
    changeTo: String,
    affectedTable: String,
    notes: String
});
var AuditTrails= mongoose.model('audit-trail', auditTrailSchema);
exports.Model = AuditTrails;