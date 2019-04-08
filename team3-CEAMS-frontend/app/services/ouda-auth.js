import Service from '@ember/service';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import crypto from 'crypto-browserify';

export default Service.extend({
  userName: null,
  encryptedPassword: null,
  isAuthenticated: false,
  store: service(),
  isLoginRequested: false,
  userCList: null,
  page: null,

  getName: computed(function () {
    let identity = localStorage.getItem('ceams-session-id');
    if (identity) {
      return this.decrypt(identity);
    } else {
      return null;
    }
  }),

  setName(name) {
    this.set('userName', name.toLowerCase());
    let identity = this.encrypt(this.get('userName'));
    localStorage.setItem('ceams-session-id', identity);
  },

  getPage: computed(function () {
    let URL = localStorage.getItem('ceams-page-id');
    if (URL) {
      return this.decrypt(URL);
    } else {
      return null;
    }
  }),

  setPage(name) {
    this.set('page', name.toLowerCase());
    let URL = this.encrypt(this.get('page'));
    localStorage.setItem('ceams-page-id', URL);
  },

  setPassword(password) {
    this.set('encryptedPassword', this.hash(password));
  },

  hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
  },

  encrypt(plainText) {
    let cipher = crypto.createCipher('aes256', 'SE3350b Winter 2019');
    let crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
  },

  decrypt(cipherText) {
    let decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2019');
    let dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
  },

  open(name, password) {
    window.localStorage.removeItem('ceams-session-id');
    window.localStorage.removeItem('ceams-page-id');
    let self = this;
    return new Promise(function (resolve, reject) {
      // send username to the server asking to connect and for a challenge (nonce)
      self.setPassword(password);
      let myStore = self.get('store');
      let loginRequest = myStore.createRecord('login', {
        userName: name,
        password: null, //first message password should be null
        nonce: null,  // a challenge from the server
        response: null,  // client response
        requestType: "open"
      });

      // send the first message of the authentication protocol
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

              let NONCE = self.encrypt(serverResponse.get('nonce'));
              let clientResponse = myStore.createRecord('login', {
                userName: name,
                password: self.get('encryptedPassword'),
                nonce: null,  // a challenge from the server
                response: NONCE,  // client response
                requestType: "openResponse"
              });
              // send the third message of the authentication protocol
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
                        let userRole = self.decrypt(message4.get('token'));
                        self.set('isAuthenticated', true);
                        self.set('userCList', userRole);
                        resolve(userRole);
                      }
                    }
                  }
                }
              );
            }
          }
        }
      })
      ;
    })
      ;
  },

  fetch() {
    // get the current token from backend database
    let self = this;
    return new Promise(function (resolve, reject) {
      let identity = localStorage.getItem('ceams-session-id');
      if (identity) {
        let name = self.decrypt(identity);
        self.set('userName', name);
        let myStore = self.get('store');
        let fetchRequest = myStore.createRecord('login', {
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
            let NONCE = self.encrypt(serverResponse.get('nonce'));
            let clientResponse = myStore.createRecord('login', {
              userName: name,
              password: null,
              nonce: null,  // a challenge from the server
              response: NONCE,  // client response
              requestType: "fetchResponse"
            });
            // send the third message of the authentication protocol
            clientResponse.save().then(function (givenToken) {
              if (givenToken.get('loginFailed')) {
                self.close(name);
                reject("fetchFailed");
              } else {
                let plainToken = self.decrypt(givenToken.get('token'));
                self.set('isAuthenticated', true);
                self.set('isLoginRequested', false);
                self.set('userCList', plainToken);
                resolve(plainToken);
              }
            });
          }
        });
      } else {
        reject("Public Access");
      }
    });
  },

  close(user) {
    let myStore = this.get('store');
    if (user === "Root") {
      let currentSession = myStore.peekAll('root');
      currentSession.forEach((rec) => {
        rec.destroyRecord();
      });
      window.localStorage.removeItem('ceams-session-id');
      window.localStorage.removeItem('ceams-page-id');
      this.set('getName', null);
      this.set('userName', null);
      this.set('isAuthenticated', false);
      this.set('isLoginRequested', true);
    } else {
      let currentSession = myStore.peekAll('login', {filter: {userName: user}});
      currentSession.forEach((rec) => {
        rec.destroyRecord();
      });
      window.localStorage.removeItem('ceams-session-id');
      window.localStorage.removeItem('ceams-page-id');
      this.set('getName', null);
      this.set('userName', null);
      this.set('encryptedPassword', null);
      this.set('isAuthenticated', false);
      this.set('isLoginRequested', true);
    }
  },

  openRoot(password) {
    let self = this;
    window.localStorage.removeItem('ceams-session-id');
    window.localStorage.removeItem('ceams-page-id');
    return new Promise(function (resolve, reject) {
      if (password) {
        let myStore = self.get('store');
        let loginRequest = myStore.createRecord('root', {
          password: null,
          nonce: null,
          response: null
        });
        loginRequest.save().then(function (serverResponse) {
          // encrypt server nonce and set client response
          let NONCE = self.encrypt(serverResponse.get('nonce'));
          let clientResponse = myStore.createRecord('root', {
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

});
