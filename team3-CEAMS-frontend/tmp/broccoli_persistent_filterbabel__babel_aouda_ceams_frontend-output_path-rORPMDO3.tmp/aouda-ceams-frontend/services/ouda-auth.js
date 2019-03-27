define("aouda-ceams-frontend/services/ouda-auth", ["exports", "crypto", "csprng"], function (_exports, _crypto, _csprng) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  //import crypto from "npm:crypto-browserify";
  var _default = Ember.Service.extend({
    userName: null,
    encryptedPassword: null,
    isAuthenticated: false,
    store: Ember.inject.service(),
    isLoginRequested: false,
    userCList: null,
    getName: Ember.computed(function () {
      var identity = localStorage.getItem('sas-session-id');

      if (identity) {
        return this.decrypt(identity);
      } else {
        return null;
      }
    }),

    setName(name) {
      this.set('userName', name.toLowerCase());
      var identity = this.encrypt(this.get('userName'));
      localStorage.setItem('sas-session-id', identity);
    },

    setPassword(password) {
      this.set('encryptedPassword', this.hash(password));
    },

    hash(text) {
      const hash = _crypto.crypto.createHash('sha256');

      hash.update(text);
      return hash.digest('binary');
    },

    encrypt(plainText) {
      var cipher = _crypto.crypto.createCipher('aes256', 'SE3350b Winter 2019');

      var crypted = cipher.update(plainText, 'ascii', 'binary');
      crypted += cipher.final('binary');
      return crypted;
    },

    decrypt(cipherText) {
      var decipher = _crypto.crypto.createDecipher('aes256', 'SE3350b Winter 2019');

      var dec = decipher.update(cipherText, 'binary', 'ascii');
      dec += decipher.final('ascii');
      return dec;
    },

    open(name, password) {
      var self = this;
      return new Promise(function (resolve, reject) {
        // send username and password to the server asking for a challenge (nonce)
        self.setPassword(password);
        var myStore = self.get('store');
        var loginRequest = myStore.createRecord('login', {
          userName: name,
          password: null,
          //first message password should be null
          nonce: null,
          // a challenge from the server
          response: null,
          // client response
          requestType: "open"
        }); // send the first message of the authentication protocol

        loginRequest.save().then(function (serverResponse) {
          //get the server challenge (message 2 in the protocol)
          if (serverResponse.get('loginFailed')) {
            self.close(name);
            reject("loginFailed");
          } else {
            // encrypt server nonce and set client response
            if (serverResponse.get('wrongUserName')) {
              //       self.close(name);
              reject("wrongUserName");
            } else {
              if (serverResponse.get('accountIsDisabled')) {
                //        self.close(name);
                reject("accountIsDisabled");
              } else {
                var NONCE = self.encrypt(serverResponse.get('nonce'));
                var clientResponse = myStore.createRecord('login', {
                  userName: name,
                  password: self.get('encryptedPassword'),
                  nonce: null,
                  // a challenge from the server
                  response: NONCE,
                  // client response
                  requestType: "openResponse"
                }); // send the third message of the authentication protocol

                clientResponse.save().then(function (message4) {
                  //get the token (message 4 in the protocol)
                  // and get the capability list or no access flag
                  // set the capability list as a token property in this service and return true
                  // or set the token property null and return false.
                  if (serverResponse.get('loginFailed')) {
                    ////  self.close(name);
                    reject("loginFailed");
                  } else {
                    if (message4.get('wrongPassword')) {
                      ////self.close(name);
                      reject("wrongPassword");
                    } else {
                      if (message4.get('passwordReset')) {
                        //self.close(name);
                        reject("passwordReset");
                      } else {
                        self.setName(name);
                        var userRole = self.decrypt(message4.get('token'));
                        self.set('isAuthenticated', true);
                        self.set('userCList', userRole);
                        resolve(userRole);
                      }
                    }
                  }
                });
              }
            }
          }
        });
      });
    },

    fetch() {
      // get the current token from backend database
      var self = this;
      return new Promise(function (resolve, reject) {
        var identity = localStorage.getItem('sas-session-id');

        if (identity) {
          var name = self.decrypt(identity);
          self.set('userName', name);
          var myStore = self.get('store');
          var fetchRequest = myStore.createRecord('login', {
            userName: name,
            password: null,
            nonce: null,
            response: null,
            requestType: "fetch"
          });
          fetchRequest.save().then(function (serverResponse) {
            if (serverResponse.get('loginFailed')) {
              self.close(name);
              reject("fetchFailed");
            } else {
              var NONCE = self.encrypt(serverResponse.get('nonce'));
              var clientResponse = myStore.createRecord('login', {
                userName: name,
                password: null,
                nonce: null,
                // a challenge from the server
                response: NONCE,
                // client response
                requestType: "fetchResponse"
              }); // send the third message of the authentication protocol

              clientResponse.save().then(function (givenToken) {
                if (givenToken.get('loginFailed')) {
                  self.close(name);
                  reject("fetchFailed");
                } else {
                  var plainToken = self.decrypt(givenToken.get('token'));
                  self.set('isAuthenticated', true);
                  self.set('userCList', plainToken);
                  resolve(plainToken);
                }
              });
            }
          });
        } else {
          reject("userNotActive");
        }
      });
    },

    close(user) {
      var myStore = this.get('store');
      myStore.query('login', {
        filter: {
          userName: user
        }
      }).then(function (Login) {
        if (Login) {
          Login.forEach(record => {
            record.destroyRecord();
          });
        }
      });
      window.localStorage.removeItem('sas-session-id');
      this.set('getName', null);
      this.set('userName', null);
      this.set('encryptedPassword', null);
      this.set('isAuthenticated', false);
      this.set('isLoginRequested', false);
    },

    openRoot(password) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (password) {
          var myStore = self.get('store');
          var loginRequest = myStore.createRecord('root', {
            password: null,
            nonce: null,
            response: null
          });
          loginRequest.save().then(function (serverResponse) {
            // encrypt server nonce and set client response
            var NONCE = self.encrypt(serverResponse.get('nonce'));
            var clientResponse = myStore.createRecord('root', {
              password: self.encrypt(self.hash(password)),
              nonce: null,
              response: NONCE
            });
            clientResponse.save().then(function (message4) {
              if (message4.get('wrongPassword')) {
                self.closeRoot();
                reject("wrongPassword");
              } else {
                // self.setName("Root");
                self.set('isAuthenticated', true);
                resolve("Root");
              }
            });
          });
        } else {
          self.closeRoot();
          reject("wrongPassword");
        }
      });
    },

    closeRoot() {
      var myStore = this.get('store');
      myStore.queryRecord('root', {}).then(function (Login) {
        if (Login) {
          Login.destroyRecord();
        }
      }); //window.localStorage.removeItem('sas-session-id');

      this.set('getName', null);
      this.set('userName', null);
      this.set('isAuthenticated', false);
      this.set('isLoginRequested', false);
    }

  });

  _exports.default = _default;
});