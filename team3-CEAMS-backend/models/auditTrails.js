//auditTrails.js
var mongoose = require('mongoose');
var auditTrailsSchema = mongoose.Schema(
    {
        timeStamp: Date,
        authorUserName: String,
        actionDesc: String,
        changeFrom: String,
        changeTo: String,
        affectedTable: String,
        notes: String
    }
);

var AuditTrails = mongoose.model('auditTrails', auditTrailsSchema);
exports.Model = AuditTrails;