import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({

  store: service(),
  modalName: computed(function () { //Add new feature
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return 'newFeature';
    } else {
      if (authentication.get('userCList').indexOf("FEAT28_010") >= 0) {
        return 'newFeature';
      } else {
        return 'access-denied';
      }
    }
  }),

  actions: {
    openModal: function() {

      this.set('code', "");
      this.set('systemFeature', "");
      var self = this;

      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable  : false,
        useFlex: false,

        onDeny    : function(){
          return true;
        },
        onApprove : function() {
          var myStore = self.get('store');
          var newFeature = myStore.createRecord('capability', {
            code: self.get('code'),
            systemFeature: self.get('systemFeature')
          });
          newFeature.save();
          return true;
        }
      })
        .modal('show');
    },

  }

});
