import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({

  store: service(),
  modalName: computed(function () { //Add new role
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return 'newRole';
    } else {
      if (authentication.get('userCList').indexOf("FEAT28_009") >= 0) {
        return 'newRole';
      } else {
        return 'access-denied';
      }
    }
  }),

  actions: {
    openModal: function () {
      this.set('name', '');
      let self = this;
      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        useFlex: false,

        onDeny: function () {
          return true;
        },

        onApprove: function () {
          var myStore = self.get('store');
          var newRoleCode = myStore.createRecord('role', {
            name: self.get('name'),
            permissions: [],
            userRoles: []
          });
          newRoleCode.save().then(function () {
            return true;
          });
        }
      })
        .modal('show');
    },

  }

});
