//instructor.js
var mongoose = require('mongoose');
var instructorsSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        building: String,
        officeNumber: String,
        number: String,
        ccMemberStatus: Boolean,
        hireDate: Date,
        estimatedRetirementDate: Date,
        keyPerformanceIndicator: Number,
        gender: {type: mongoose.Schema.ObjectId, ref: ('Genders')},
        evaluationMethod: {type: mongoose.Schema.ObjectId, ref: ('UserEvaluationMethods')},
        programs: [{type: mongoose.Schema.ObjectId, ref: ('Programs')}],
        licenceProviders: [{type: mongoose.Schema.ObjectId, ref: ('LicenceProviders')}],
        degreeProviders: [{type: mongoose.Schema.ObjectId, ref: ('DegreeProviders')}],
        rank: {type: mongoose.Schema.ObjectId, ref: ('AcademicRanks')},
        semesters: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}],
        memberships: [{type: mongoose.Schema.ObjectId, ref: ('committeeMembership')}],
        userShadow: {type: mongoose.Schema.ObjectId, ref: ('UserAccounts')}

    }
);
var Instructors = mongoose.model('instructor', instructorsSchema);
exports.Model = Instructors;