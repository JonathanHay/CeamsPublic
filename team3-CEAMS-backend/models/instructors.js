//instructors.js
var mongoose = require('mongoose');
var instructorSchema = mongoose.Schema(
 {
 number: String,
 CCMemberStatus: Boolean,
 hireDate: Date,
 estimatedRetirementDate: Date,
 keyPerformanceIndicator: Double,

 //userprofile attr
 firstName: String,
 lastName: String,
 email: String,
 building: String,
 officeNumber: String,

 semesters: [{type: mongoose.Schema.ObjectId, ref:('Semesters')}],
 staff: [{type: mongoose.Schema.ObjectId, ref:('Staff')}],
 userEvaluationMethod: {type: mongoose.Schema.ObjectId, ref:('UserEvaluationMethods')},
 teachingAssistants: [{type: mongoose.Schema.ObjectId, ref:('TeachingAssistants')}],
 programs: [{type: mongoose.Schema.ObjectId, ref:('Programs')}],
 
 //routes
 licenseStatus: [{type: mongoose.Schema.ObjectId, ref:('LicenseStatus')}],
 academicRank: {type: mongoose.Schema.ObjectId, ref:('AcademicRanks')},
 academicDegrees: [{type: mongoose.Schema.ObjectId, ref:('AcademicDegrees')}],
 }

);
var Instructors = mongoose.model("instructors", instructorSchema);
exports.Model = Instructors