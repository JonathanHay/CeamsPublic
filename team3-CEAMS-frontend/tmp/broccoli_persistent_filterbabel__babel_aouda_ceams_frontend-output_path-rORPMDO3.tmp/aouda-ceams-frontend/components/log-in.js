define("aouda-ceams-frontend/components/log-in", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    routing: Ember.inject.service('router'),
    error: null,
    errorMessage: Ember.computed('error', function () {
      return this.get('error');
    }),
    actions: {
      login() {
        var authentication = this.get('oudaAuth');
        var self = this;

        if (this.get('name') === "root") {
          authentication.openRoot(this.get('password')).then(function (name) {
            self.get('oudaAuth').set('isLoginRequested', false);
            authentication.set('getName', name);
            console.log(name);
            self.get('routing').transitionTo('main-menu');
          }, function () {//console.log("Root" + error);
          });
        } else {
          self.set('error', null);
          authentication.open(this.get('name'), this.get('password')).then(function () {
            self.get('oudaAuth').set('isLoginRequested', false);
            authentication.set('getName', self.get('name'));
            self.get('routing').transitionTo('home');
          }, function (error) {
            if (error === "accountIsDisabled") {
              self.set('error', 'This account is disabled, please contact the system administrator');
            } else {
              if (error === "passwordReset") {
                Ember.$('.ui.changePassword.modal').modal({
                  closable: false,
                  detachable: false,
                  onDeny: function () {
                    self.set('error', null);
                    return true;
                  },
                  onApprove: function () {
                    if (!self.get('firstPassword') || self.get('firstPassword').trim().length === 0) {
                      self.set('error', 'Your must enter a password value');
                      return false;
                    } else {
                      if (self.get('firstPassword') !== self.get('secondPassword')) {
                        self.set('error', 'Your password and confirmation password do not match');
                        return false;
                      } else {
                        self.set('error', null);
                        var authentication = self.get('oudaAuth');
                        var myStore = self.get('store');
                        var userName = self.get('name');
                        var hashedPassword = authentication.hash(self.get('firstPassword'));
                        myStore.queryRecord('password', {
                          filter: {
                            userName: userName
                          }
                        }).then(function (userShadow) {
                          userShadow.set('encryptedPassword', hashedPassword);
                          userShadow.set('passwordMustChanged', true);
                          userShadow.set('passwordReset', false);
                          userShadow.save().then(function () {
                            self.get('oudaAuth').close();
                            self.get('oudaAuth').set('isLoginRequested', true);
                            self.get('routing').transitionTo('login'); //  return true;
                          });
                        });
                      }
                    }
                  }
                }).modal('show');
              } else {
                if (error === "wrongUserName") {
                  self.set('error', 'Please enter a correct user name');
                } else {
                  if (error === "wrongPassword") {
                    self.set('error', 'Please enter a correct password');
                  } else {
                    if (error === "loginFailed") {
                      self.set('error', 'Login Failed ...');
                    }
                  }
                }
              }
            }
          });
        }
      }

    }
  });

  _exports.default = _default;
});