//staffs.js
var mongoose = require('mongoose');
var staffsSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        building: String,
        officeNumber: String,
        roleName: String,
        keyPerformanceIndicator: Number,
        gender: {type: mongoose.Schema.ObjectId, ref: ('Genders')},
        evaluationMethod: {type: mongoose.Schema.ObjectId, ref: ('UserEvaluationMethods')},
        memberships: [{type: mongoose.Schema.ObjectId, ref: ('CommitteeMemberships')}],
        userShadow: {type: mongoose.Schema.ObjectId, ref: ('UserAccounts')}
    }
);
var Staffs = mongoose.model('staff', staffsSchema);
exports.Model = Staffs;