//staff.js
var mongoose            = require('mongoose');
var StaffSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        building: String,
        officeNumber: String,
        roleName: String,
        keyPerformanceIndicator: String,
        userAccount: {type: mongoose.Schema.ObjectId, ref: ('UserAccount')},
        evaluationMethod: {type: mongoose.Schema.ObjectId, ref: ('Questions')}
    }
)
var Staff = mongoose.model('staff', StaffSchema);
exports.model = Staff;