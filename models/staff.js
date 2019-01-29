//staff.js
var mongoose    = require('mongoose');
var StaffSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        building: String,
        officeNumber: String,
        roleName: String,
        keyPerformanceIndicator: String,
        userShadow: {type: mongoose.Schema.ObjectId, ref: ('UserAccounts')},
        evaluationMethod: {type: mongoose.Schema.ObjectId, ref: ('Questions')}
    }
)
var Staff = mongoose.model('staff', StaffSchema);
exports.model = Staff;