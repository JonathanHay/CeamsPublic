let mongoose = require('mongoose');
let userAccountsSchema = mongoose.Schema(
    {
        userName: String,
        encryptedPassword: String,
        salt: String,
        userAccountExpiryDate: Date,
        passwordMustChanged: Boolean,
        passwordReset: Boolean,
        enabled: Boolean,
        instructor: {type: mongoose.Schema.ObjectId, ref: ('Instructors')},
        staff: {type: mongoose.Schema.ObjectId, ref: ('Staffs')},
        teachingAssistant: {type: mongoose.Schema.ObjectId, ref: ('TeachingAssistants')},
        userGivenRoles: [{type: mongoose.Schema.ObjectId, ref: ('UserGivenRoles')}]
    }
);
let UserAccounts = mongoose.model('userAccount', userAccountsSchema);
exports.Model = UserAccounts;