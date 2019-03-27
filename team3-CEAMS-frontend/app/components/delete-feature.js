import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

function showError(modalName) {
  $('.ui.' + modalName + '.modal').modal({
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
  ID: null,

  errorDeleteModalName: computed(function () {
    return 'errorDelete' + this.get('ID');
  }),

  confirmDeleteModalName: computed(function () {
    return 'deleteFeature' + this.get('ID');
  }),

  FEAT28_012IsPermitted: computed(function(){ //Delete Feature
    let authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_012") >= 0);
    }
  }),

  actions: {
    deleteOneFeature: function () {
      let id = this.get('ID');
      let myStore = this.get('store');
      myStore.query('permission', {filter: {permission: 'true', feature: id}}).then((feature)=> {
        if (feature.length > 0) {
          showError(this.get('errorDeleteModalName'));
        } else {
          $('.ui.' + this.get('confirmDeleteModalName') + '.modal').modal({
            closable: false,
            useFlex: false,

            onDeny: () => {
              return true;
            },
            onApprove: () => {
              myStore.peekRecord('capability', id).destroyRecord().then(()=>{
                this.toggleProperty('redraw');
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

