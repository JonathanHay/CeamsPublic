import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery';
import {computed} from '@ember/object';

export default Component.extend({
  DS: service('store'),
  uniqueName: null,

  modalName: computed(function () {
    let random = Math.random();
    this.set('uniqueName', Math.random().toString().split('.')[1] + this.get('ID'));
    return 'ui ' + this.get('uniqueName') + ' modal';
  }),

  FEAT07_003IsPermitted: computed(function(){ //Delete course
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT07_003") >= 0);
    }
  }),

  actions: {
    openModal: function () {
      $('.ui.' + this.get('uniqueName') + '.modal').modal({
        closable: false,
        useFlex: false,

        onDeny: () => {
          return true;
        },
        onApprove: () => {
          this.get('DS').findRecord('course', this.get('ID'),{ reload: true }).then((course) => {
            // delete all related referenced tables first


            // now we delete the record itself
            course.destroyRecord().then(() => {
              return true;
            });
          })
        }
      })
        .modal('show');
    },
  }
});