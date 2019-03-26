var express = require('express');
var router = express.Router();
var Roots = require('../models/roots');
const crypto = require('crypto');
var rand = require('csprng');

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

function deletedRecord() {
    var deleted = new Roots.Model({
        password: null,
        nonce: null,
        response: null,
        wrongPassword: null,
        sessionIsActive: null
    });

    deleted.save(function (error) {
        if (error) return console.error(error);
        return deleted;
    });

};

router.route('/')
    .post(function (request, response) {
        if (request.body.root.password === null) {  // First message in the oudaAuth protocol
            // make sure to delete any leftover from any previous session for the same user if any.
            Roots.Model.find({}, function (error, oldLogins) {
                oldLogins.forEach(function (record) {
                    Roots.Model.findByIdAndDelete(record.id,
                        function (error, deleted) {
                        }
                    );
                });
                // Generate new nonce
                if (request.body.root.nonce === null) {
                    var newLogin = new Roots.Model({
                        password: null,
                        nonce: rand(256, 36),
                        response: null
                    });
                    newLogin.save(function (error, rec) { // second message in the oudaAuth protocol
                        if (error) return console.error(error);
                        response.json({root: rec});
                    });
                }
            });

        } else {
            if (request.body.root.response !== null) { // third message in the oudaAuth protocol
                // Now we need to verify the nonce and the password
                var receivedNonce = decrypt(request.body.root.response);
                var storedNonce = null;
                Roots.Model.findOne({}, function (error, message4) {
                    if (!error) {
                        storedNonce = message4.nonce;
                        if (receivedNonce === storedNonce) {
                            // Now this session is confirmed fresh. Let us authenticate the user.
                            var receivedPassword = request.body.root.password;

                            // This stored encrypted password needs to be saved in
                            // an external protected file, that can be managed by external tool
                            // other than CEAMS application.
                            var stored = encrypt(hash("root"));
                            var storedPassword = stored;
                            if (receivedPassword === storedPassword) {


                                message4.sessionIsActive = true;
                                message4.save(function (error) { // fourth message in the oudaAuth protocol
                                    if (error) return console.error(error);


                                    var rec = new Roots.Model({
                                        password: null,
                                        nonce: null,
                                        response: null,
                                        wrongPassword: null,
                                        sessionIsActive : true
                                    });
                                    response.json({root: rec});

                                });
                            }
                        } else {
                            // password must be wrong, server will send "wrong password" message
                            message4.nonce = null;
                            message4.response = null;
                            message4.wrongPassword = true;
                            var rec = new Roots.Model({
                                nonce: null,
                                response: null,
                                wrongPassword: true
                            });

                            response.json({root: rec});
                        }
                    } else {
                        message4.nonce = null;
                        message4.response = null;
                        message4.wrongPassword = true;
                        var rec = new Roots.Model({
                            nonce: null,
                            response: null,
                            wrongPassword: true
                        });
                        response.json({root: rec});
                    }
                });
            }
        }
    })
    .get(function (request, response) {
        var LOGIN = request.query.filter;
        if (!LOGIN) {
            Roots.Model.find(function (error, Root) {
                if (error) response.json({root: error});
                response.json({root: Root});
            });
        } else {
            Roots.Model.findOne({"sessionIsActive": LOGIN.sessionIsActive}, function (error, Root) {
                if (error) response.json({root: error});
                response.json({root: Root});
            });
        }
    });

router.route('/:root_id')
    .get(function (request, response) {
        Roots.Model.findById(request.params.root_id, function (error, root) {
            if (error) {
                response.send({error: error});
            } else {
                response.json({root: root});
            }
        });
    })
    .delete(function (request, response) {
        Roots.Model.findByIdAndDelete(request.params.root_id,
            function (error, deleted) {
                if (!error) {
                    response.json({root: deleted});
                }
            }
        );
    });

module.exports = router;
