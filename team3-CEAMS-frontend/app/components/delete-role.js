import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

function showError(modalName) {
  $('.ui.' + modalName + '.modal').modal({
    closable: false,
    useFlex: false,

    onDeny: () => {
      return true;
    },
    onApprove: () => {
      return true;
    }
  })
    .modal('show');
}

export default Component.extend({
  store: service(),
  routing: service('router'),

  errorDeleteModalName: computed(function () {
    return 'errorDelete' + this.get('model').id;
  }),

  confirmDeleteModalName: computed(function () {
    return 'deleteRole' + this.get('model').id;
  }),


  FEAT28_013IsPermitted: computed(function(){ //Delete Role
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_013") >= 0);
    }
  }),

  actions: {

    openModal: function () {
      let roleID = this.get('model').id;
      let self = this;

      let myStore = this.get('store');
      myStore.query('userGivenRole', {filter: {role: roleID}}).then((userRole)=> {
        if (userRole.length > 0) {
          showError(this.get('errorDeleteModalName'));
        } else {

          $('.ui.' + this.get('confirmDeleteModalName') + '.modal').modal({
            closable: false,
            onDeny: () => {
              return true;
            },
            onApprove: () => {
              myStore.peekRecord('role', roleID).destroyRecord().then(()=>{

                return true;
              });
            }
          })
            .modal('show');
        }
      });
    }
  }
});
