import Component from '@ember/component';
import {computed} from '@ember/object';
import {observer} from '@ember/object';
import {inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  userRecord: null,
  ID: null,
  Model: null,
  selectedDate: null,
  userName: null,
  encryptedPassword: null,
  isResettingPassword: null,
  error: null,
  wrongUserName: false,
  oldUserName: null,


  errorMessage: computed('error', function () {
    return this.get('error');
  }),

  isUniqueUserName: observer('userName', function () {
    this.set('error', null);

    var myStore = this.get('store');
    myStore.queryRecord('userAccount', {filter: {userName: this.get('userName')}}).then((userShadow) => {
      if (userShadow) {
        this.set('wrongUserName', true);
      } else {
        this.set('wrongUserName', false);
      }
    })

  }),

  modalName: computed(function () {
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return 'editUser' + (this.get('userRecord')).id;
    } else {
      if (authentication.get('userCList').indexOf("FEAT28_002") >= 0) {
        return 'editUser' + (this.get('userRecord')).id;
      } else {
        return 'accessdenied' + (this.get('userRecord')).id;
      }
    }

  }),

  FEAT28_002IsPermitted: computed(function () { //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_002") >= 0);
    }
  }),
  FEAT28_003IsPermitted: computed(function () { //ResetPassword
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_003") >= 0);
    }
  }),
  FEAT28_004IsPermitted: computed(function () { //Delete user
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_004") >= 0);
    }
  }),


  actions: {
    openModal: function () {
      this.set('error', null);
      var userID = this.get('ID');
      var myStore = this.get('store');

      let date = this.get('userRecord').get('userAccountExpiryDate');

      let datestring = date.toISOString().substring(0, 10);
      this.set('selectedDate', datestring);
      this.set('userName', this.get('userRecord').get('userName'));
      this.set('oldUserName', this.get('userRecord').get('userName'));
      let self = this;
      $('.ui.' + self.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        useFlex: false,

        onDeny: function () {
          return true;
        },
        onApprove: function () {
          let myStore = self.get('store');
          if ((self.get('userName') !== self.get('oldUserName')) && (self.get('wrongUserName'))) {
            self.set('error', self.get('userName') + ' is not available, please enter another user name');
            return false;
          } else {
            self.get('userRecord').set('userAccountExpiryDate', new Date(self.get('selectedDate')));

            if (self.get('isResettingPassword')) {
              var authentication = self.get('oudaAuth');
              self.get('userRecord').set('encryptedPassword', authentication.hash(self.get('tempPassword')));
              self.get('userRecord').set('passwordMustChanged', true);
              self.get('userRecord').set('passwordReset', true);
            }
            self.get('userRecord').set('userName', self.get('userName'));

          }
        }
      })
        .modal('show');

    },

    assignDate(date) {
      this.set('selectedDate', date);
    }
    ,

    resetPassword() {
      this.set('isResettingPassword', true);
    }
    ,

    cancelResetPassword() {
      this.set('isResettingPassword', false);
    }
    ,

  }
})
;

