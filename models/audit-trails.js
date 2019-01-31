//audit-trails.js
var mongoose = require('mongoose');
var auditTrailsSchema = mongoose.Schema({
    timeStamp: Date,
    authorUserName: String,
    actionDesc: String,
    changeFrom: String,
    changeTo: String,
    affectedTable: String,
    notes: String
});
var AuditTrails= mongoose.model('audit-trail', auditTrailsSchema);
exports.Model = AuditTrails;