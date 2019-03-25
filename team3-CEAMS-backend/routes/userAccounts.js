let express = require('express');
let router = express.Router();
let UserAccounts = require('../models/userAccounts');
let bodyParser = require('body-parser');
let parseUrlencoded = bodyParser.urlencoded({extended: false});
let parseJSON = bodyParser.json();
const crypto = require('crypto');
let rand = require('csprng');


function hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
};

function encrypt(plainText) {
    var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2019');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

function decrypt(cipherText) {
    var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2019');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
};


router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var Salt = rand(256, 36);
        var EncryptedPassword = hash(request.body.userAccount.encryptedPassword + Salt);
        var newUserShadow = new UserAccounts.Model({
            salt: Salt,
            encryptedPassword: EncryptedPassword,
            userName: request.body.userAccount.userName,
            passwordMustChanged: request.body.userAccount.passwordMustChanged,
            passwordReset: request.body.userAccount.passwordReset,
            userAccountExpiryDate: request.body.userAccount.userAccountExpiryDate,
            instructor: request.body.userAccount.instructor,
            staff: request.body.userAccount.staff,
            teachingAssistant: request.body.userAccount.teachingAssistant,
            enabled: request.body.userAccount.enabled

        });

        newUserShadow.save(function (error) {
            if (error) {
                response.send({error: error});
            } else {
                response.json({userAccount: newUserShadow});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var USER = request.query.filter;
        if (!USER) {
            UserAccounts.Model.find(function (error, UserShadows) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({userAccount: UserShadows});
                }
            })
        } else {
            UserAccounts.Model.findOne({"userName": USER.userName}, function (error, UserShadow) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({userAccount: UserShadow});
                }
            });
        }
    });


router.route('/:userAccount_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        UserAccounts.Model.findById(request.params.userAccount_id, function (error, UserShadow) {
            if (error) {
                response.send({error: error});
            } else {
                response.json({userAccount: UserShadow});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        UserAccounts.Model.findById(request.params.userAccount_id, function (error, UserShadow) {
            if (error) {
                response.send({error: error});
            } else {
                if (request.body.userAccount.passwordMustChanged) {
                    var Salt = rand(256, 36);
                    UserShadow.encryptedPassword = hash(request.body.userAccount.encryptedPassword + Salt);
                    UserShadow.salt = Salt;
                    UserShadow.passwordMustChanged = false;
                }
                UserShadow.passwordReset = request.body.userAccount.passwordReset;
                UserShadow.userName = request.body.userAccount.userName;
                UserShadow.userAccountExpiryDate = request.body.userAccount.userAccountExpiryDate;

                UserShadow.instructor = request.body.userAccount.instructor;
                UserShadow.staff = request.body.userAccount.staff;
                UserShadow.teachingAssistant = request.body.userAccount.teachingAssistant;
                UserShadow.enabled = request.body.userAccount.enabled;


                UserShadow.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        response.json({userAccount: UserShadow});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        UserAccounts.Model.findByIdAndRemove(request.params.userAccount_id,
            function (error, deleted) {
                if (!error) {
                    response.json({userAccount: deleted});
                }
            }
        );
    });

module.exports = router;
