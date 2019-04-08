import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({

  store: service(),
uniqueName:null,

  modalName: computed(function () {
    let random = Math.random();
    this.set('uniqueName', Math.random().toString().split('.')[1] );
    return 'ui ' + this.get('uniqueName') + ' modal';
  }),

  FEAT28_010IsPermitted: computed(function(){
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_010") >= 0);
    }
  }),

  actions: {
    openModal: function() {

      this.set('code', "");
      this.set('systemFeature', "");
      var self = this;

      $('.ui.' + this.get('uniqueName') + '.modal').modal({
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