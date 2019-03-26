let express = require('express');
let router = express.Router();
let UserRoles = require('../models/userGivenRoles');
let UserAccounts = require('../models/userAccounts');
let Logins = require('../models/logins');
let Permissions = require('../models/permissions');
let Features = require('../models/capabilities');


let bodyParser = require('body-parser');
let parseUrlencoded = bodyParser.urlencoded({extended: false});
let parseJSON = bodyParser.json();
const crypto = require('crypto');
let rand = require('csprng');

function hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
}

function encrypt(plainText) {
    let cipher = crypto.createCipher('aes256', 'SE3350b Winter 2019');
    let crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
}

function decrypt(cipherText) {
    let decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2019');
    let dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
}

function failedLogin() {
    let failed = new Logins.Model({
        nonce: null,
        token: null,
        loginFailed: true
    });

    failed.save(function (error) {
        if (error) return console.error(error);
        return failed;
    });

}


router.route('/')
    .post(function (request, response) {
        UserAccounts.Model.findOne({"userName": request.body.login.userName}, function (error, UserShadow) {
                if (error || !UserShadow) {
                    // Username must be wrong, server will send "wrong username" message
                    let badUserName = new Logins.Model({
                        userName: request.body.login.userName,
                        password: null,
                        nonce: null,
                        response: null,
                        token: null,
                        wrongUserName: true
                    });
                    response.json({login: badUserName});
                } else {
                    // check if the account is disabled or not

                    if (UserShadow.enabled) {


                        // Now deal with the first message in the oudaAuth protocol
                        if (request.body.login.requestType === "open") {// first message in the oudaAuth protocol
                            // make sure to delete any leftover logins from any previous session for the same user if any.
                            Logins.Model.find({"userName": request.body.login.userName}, function (error, oldLogins) {
                                oldLogins.forEach(function (record) {
                                    Logins.Model.findByIdAndDelete(record.id,
                                        function (error, deleted) {
                                        }
                                    );
                                });


                                let newLogin = new Logins.Model({
                                    userName: request.body.login.userName,
                                    password: null,
                                    nonce: rand(256, 36), // this is the server challenge
                                    response: null,
                                    loginFailed: false,
                                    token: null
                                });
                                newLogin.save(function (error) {// second message in the oudaAuth protocol
                                    if (error) response.json({login: failedLogin()});
                                    response.json({login: newLogin});
                                });
                            });

                        } else {
                            if (request.body.login.requestType === "openResponse") { // third message in the oudaAuth protocol
                                // Now we need to verify the received nonce and the password
                                if (request.body.login.response) {
                                    let receivedNonce = decrypt(request.body.login.response);
                                    let storedNonce = null;
                                    Logins.Model.findOne({"userName": request.body.login.userName}, function (error, message4) {
                                        if (message4) {
                                            storedNonce = message4.nonce;
                                            if (receivedNonce === storedNonce) {
                                                // Now this session is confirmed fresh. Let us authenticate the user.
                                                let receivedPassword = request.body.login.password;
                                                let storedPassword = null;
                                                let salt = null;
                                                storedPassword = UserShadow.encryptedPassword;
                                                salt = UserShadow.salt;
                                                let saltedPassword = hash(receivedPassword + salt);
                                                if (saltedPassword === storedPassword) {
                                                    // Now the user is authenticated.
                                                    //
                                                    // if password is pending change, server will send a message
                                                    // letting the user to change password and then try login again
                                                    //
                                                    // if not pending change server will send the encrypted token
                                                    // (the capability list).
                                                    if (UserShadow.passwordReset) {
                                                        message4.token = null;
                                                        message4.passwordReset = true;
                                                        let rec = new Logins.Model({
                                                            token: null,
                                                            passwordReset: true
                                                        });

                                                        response.json({login: rec});
                                                    } else {
                                                        let counter = {};
                                                        let token = ["about"];
                                                        UserRoles.Model.find({"user": UserShadow.id}, function (error, userRoles) {
                                                            userRoles.forEach((userRole) => {
                                                                let roleID = userRole.role;
                                                                Permissions.Model.find({"role": roleID}, function (error, permissions) {
                                                                    counter[roleID] = permissions.length;
                                                                    while (permissions.length > 0) {
                                                                        let permission = permissions.pop();
                                                                        Features.Model.findById(permission.feature, function (err, feature) {
                                                                            token.push(feature.code);
                                                                            counter[roleID] = counter[roleID] - 1;
                                                                            let numberOfRoles = (Object.keys(counter)).length;
                                                                            let totalFeaturesLeft = counter[roleID];
                                                                            userRoles.forEach((userRole) => {
                                                                                totalFeaturesLeft += counter[userRole.role];
                                                                            });
                                                                            if (totalFeaturesLeft === 0) {
                                                                                message4.token = encrypt(JSON.stringify(token));
                                                                                message4.sessionIsActive = true;
                                                                                message4.loginFailed = false;
                                                                                message4.save(function (error) { // fourth message in the oudaAuth protocol
                                                                                    if (error) response.json({login: failedLogin()});
                                                                                    let rec = new Logins.Model({
                                                                                        token: encrypt(JSON.stringify(token)),
                                                                                        sessionIsActive: true,
                                                                                        loginFailed: false
                                                                                    });
                                                                                    response.json({login: rec});
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            })

                                                        })
                                                    }
                                                } else {
                                                    // password must be wrong, server will send "wrong password" message
                                                    message4.token = null;
                                                    message4.nonce = null;
                                                    message4.response = null;
                                                    message4.wrongPassword = true;
                                                    //console.log("wrong password");

                                                    let rec = new Logins.Model({
                                                        token: null,
                                                        nonce: null,
                                                        response: null,
                                                        wrongPassword: true
                                                    });
                                                    response.json({login: rec});


                                                }
                                            } else {
                                                response.json({login: failedLogin()});
                                            }
                                        } else {
                                            response.json({login: failedLogin()});
                                        }
                                    });
                                } else {
                                    response.json({login: failedLogin()});
                                }
                            } else {
                                if (request.body.login.requestType === "fetch") { //This is to maintain the instance of the current authenticated session

                                    let connection = new Logins.Model({
                                        userName: request.body.login.userName,
                                        password: null,
                                        nonce: rand(256, 36), // this is the server challenge
                                        response: null,
                                        token: null
                                    });
                                    connection.save(function (error) {// second message in the authentication protocol
                                        if (error) response.json({login: failedLogin()});
                                        response.json({login: connection});
                                    });

                                } else {
                                    if (request.body.login.requestType === "fetchResponse") {
                                        Logins.Model.findOne({"userName": request.body.login.userName}, function (error, Fetch) {
                                            if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
                                            response.json({login: Fetch}); //respond to the fetch request
                                        });
                                    } else {
                                        response.json({login: failedLogin()});
                                    }
                                }
                            }
                        }
                    } else {
                        // User account is disabled, server will send an error message
                        let accountDisabled = new Logins.Model({
                            userName: request.body.login.userName,
                            password: null,
                            nonce: null,
                            response: null,
                            token: null,
                            accountIsDisabled: true
                        });
                        response.json({login: accountDisabled});
                    }


                }
            }
        );
    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        let LOGIN = request.query.filter;
        if (!LOGIN) {
            Logins.Model.find(function (error, Login) {
                if (error) response.json({login: failedLogin()});
                response.json({login: Login});
            });
        } else {
            Logins.Model.findOne({"userName": LOGIN.userName}, function (error, Login) {
                if (error) response.json({login: failedLogin()});
                response.json({login: Login});
            });
        }
    });


router.route('/:login_id')
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Logins.Model.findByIdAndDelete(request.params.login_id,
            function (error, deleted) {
                if (!error) {
                    response.json({login: deleted});
                }
            }
        );
    });

module.exports = router;