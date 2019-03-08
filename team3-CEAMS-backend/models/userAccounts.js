var mongoose = require('mongoose');
var userAccountsSchema = mongoose.Schema(
    {
        username: String,
        encryptedPassword: String,
        salt: String,
        userAccountExpiryDate: Date,
        passwordMustChanged: Boolean,
        passwordReset: Boolean,
        instructor: {type: mongoose.Schema.ObjectId, ref: ('Instructors')},
        staff: {type: mongoose.Schema.ObjectId, ref: ('Staffs')},
        teachingAssistant: {type: mongoose.Schema.ObjectId, ref: ('TeachingAssistants')},
        userGivenRoles: [{type: mongoose.Schema.ObjectId, ref: ('UserGivenRoles')}]
    }
);
var UserAccounts = mongoose.model('userAccounts', userAccountsSchema);
exports.Model = UserAccounts;