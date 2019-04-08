import Component from '@ember/component';
import {computed} from '@ember/object';
import {observer} from '@ember/object';
import {inject as service} from '@ember/service';
import $ from 'jquery';


export default Component.extend({
  store: service(),
  selectedDate: null,
  error: null,
  tagName: '',
  wrongUserName: true,
  instructorObject: null,
  staffObject: null,
  teachingAssistantObject: null,


  errorMessage: computed('error', function () {
    return this.get('error');
  }),

  isUniqueUserName: observer('userName', function () {
    this.set('error', null);
    let myStore = this.get('store');
    let userShadow = myStore.peekAll('userAccount', {filter: {userName: this.get('userName')}});
    let obj = userShadow.find(one => one.userName === this.get('userName'));
    if (obj) {
      this.set('wrongUserName', true);
    } else {
      this.set('wrongUserName', false);
    }
  }),

  instructors: computed(function () {
    return this.get('store').peekAll('instructor');
  }),

  staffs: computed(function () {
    return this.get('store').peekAll('staff');
  }),

  TAs: computed(function () {
    return this.get('store').peekAll('teachingAssistant');
  }),

  readOnlyField: observer('selectedUser', function () {
    this.set('instructorObject', null);
    this.set('staffObject', null);
    this.set('teachingAssistantObject', null);

    let key = (this.get('selectedUser')).split(" ")[0];
    let modelName = (this.get('selectedUser')).split(" ")[1];

    if (modelName === 'teaching-assistant') {
      this.set('teachingAssistantObject', this.get('store').peekRecord(modelName, key));
    } else {
      this.set(modelName + 'Object', this.get('store').peekRecord(modelName, key));
    }

    this.set('firstName', this.get('store').peekRecord(modelName, key).firstName);
    this.set('lastName', this.get('store').peekRecord(modelName, key).lastName);
    this.set('email', this.get('store').peekRecord(modelName, key).email);
  }),

  actions: {
    openModal: function () {
      //   this.set('error', null);
      let datestring = (new Date()).toISOString().substring(0, 10);
      this.set('selectedDate', datestring);
      this.set('firstName', "");
      this.set('lastName', "");
      this.set('email', "");
      this.set('userName', "");
      this.set('password', "");
      let self = this;
      $('.ui.newUser.modal').modal({
        closable: false,
        useFlex: false,
        autofocus: false,

        onDeny: function () {
          return true;
        },
        onApprove: function () {
          let myStore = self.get('store');
          if (self.get('wrongUserName')) {
            self.set('error', self.get('userName') + ' is not available, please enter another user name');
            return false;
          } else {
            let authentication = self.get('oudaAuth');
            let newUserAccount = myStore.createRecord('userAccount', {
              userName: self.get('userName'),
              encryptedPassword: authentication.hash(self.get('password')),
              userAccountExpiryDate: new Date(self.get('selectedDate')),
              passwordReset: true,
              passwordMustChanged: true,
              enabled: true,
              instructor: self.get('instructorObject'),
              staff: self.get('staffObject'),
              teachingAssistant: self.get('teachingAssistantObject')
            });
            newUserAccount.save().then((rec) => {
              if (self.get('instructorObject')) {
                self.get('instructorObject').set('userShadow', rec);
                self.get('instructorObject').save();
              }
              if (self.get('staffObject')) {
                self.get('staffObject').set('userShadow', rec);
                self.get('staffObject').save();
              }
              if (self.get('teachingAssistantObject')) {
                self.get('teachingAssistantObject').set('userShadow', rec);
                self.get('teachingAssistantObject').save();
              }

              return true;
            });
          }
        }
      })
        .modal('show');
    },

    assignDate(date) {
      this.set('selectedDate', date);
    },

  }
});