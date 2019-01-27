//audit-trail.js
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
var AuditTrail= mongoose.model('AuditTrail', auditTrailSchema);
exports.Model = AuditTrail;