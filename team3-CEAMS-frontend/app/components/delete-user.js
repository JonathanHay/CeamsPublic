import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  userRecord: null,
  ID: null,
  uniqueName:null,

  modalName: computed(function () {
    let random = Math.random();
    this.set('uniqueName', Math.random().toString().split('.')[1] + this.get('userRecord').id);
    return 'ui ' + this.get('uniqueName') + ' modal';
  }),

  FEAT28_004IsPermitted: computed(function(){ //Delete user
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_004") >= 0);
    }
  }),

  actions: {
    openModal: function () {
      let self = this;
      $('.ui.' + this.get('uniqueName') + '.modal').modal({
        closable: false,
        useFlex: false,

        onDeny: function () {
          return true;
        },
        onApprove: function () {
          let myStore = self.get('store');
          let userID = self.get('userRecord').id;

          let user = myStore.peekRecord('userAccount', userID);
          user.destroyRecord().then((rec)=>{
            // cleanup the link with Instructor, staff and teaching assistant (if any)
            if (rec.get('instructor').get('id') != undefined){
              let instructor = myStore.peekRecord('instructor', rec.get('instructor').get('id'));
              instructor.set('userShadow', null);
              instructor.save(()=>{
                return true;
              });
            }
            if (rec.get('staff').get('id') != undefined){
              let staff = myStore.peekRecord('staff', rec.get('staff').get('id'));
              staff.set('userShadow', null);
              staff.save(()=>{
                return true;
              });
            }
            if (rec.get('teachingAssistant').get('id') != undefined){
              let teachingAssistant = myStore.peekRecord('teachingAssistant', rec.get('teachingAssistant').get('id'));
              teachingAssistant.set('userShadow', null);
              teachingAssistant.save(()=>{
                return true;
              });
            }
            // cleanup the link with UserGivenRole
            myStore.query('userGivenRole', {filter: {user: userID}}).then(function (userRoles) {
              userRoles.forEach(function (userRole) {
                  userRole.destroyRecord();
              });
            });
          });
        }
      })
        .modal('show');
    },
  }


});