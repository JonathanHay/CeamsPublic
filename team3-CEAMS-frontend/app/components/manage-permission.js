import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  givenFeatures: [],
  selectedFeatures: [],

  capabilityModel: computed(function () {
    return this.get('store').peekAll('capability');
  }),

  modalName: computed(function () {
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return 'uniqueName' + (this.get('model').id) + (((this.get('model').name).replace(/\s+/g, '-').toLowerCase()));
    } else {
      if (authentication.get('userCList').indexOf("FEAT28_014") >= 0) {
        return 'uniqueName' + ((this.get('model').name).replace(/\s+/g, '-').toLowerCase()) + this.get('model').id;
      } else {
        return 'access-denied' + ((this.get('model').name).replace(/\s+/g, '-').toLowerCase())+ this.get('model').id;
      }
    }
  }),

  FEAT28_014IsPermitted: computed(function () {
    let authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_014") >= 0);
    }
  }),

  actions: {
    openModal: function () {
      this.set('givenFeatures', []);
      let code = this.get('model').id;
      let myStore = this.get('store');
      let self = this;

      // Initialize the saved (old given features)
      (this.get('model').permissions).forEach((rec) => {
        this.get('givenFeatures').push(rec.get('feature').get('id'));
        this.get('selectedFeatures').push(rec.get('feature').get('id'));
      });

      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        useFlex: false,

        onDeny: function () {
          return true;
        },
        onApprove: function () {
          // Delete the current features
          (self.get('model').permissions).forEach((rec) => {
            rec.destroyRecord();
          });
          // store the new selected features
          // we will update the role data first just in case user has changed its name
          let roleObject = myStore.peekRecord('role', code);
          roleObject.set('name', self.get('model').name);
          roleObject.save().then((savedRole) => {

            while (self.get('selectedFeatures').length > 0) {
              let feature = self.get('selectedFeatures').pop();


              let capabilityObject = myStore.peekRecord('capability', feature);
              let newPermission = myStore.createRecord('permission', {
                permission: true,
                role: savedRole,
                feature: capabilityObject
              });
              newPermission.save(() => {
                if (self.get('selectedFeatures').length === 0) {
                  return true;
                }
              })
            }
          })
        }
      })
        .modal('show');
    }
  }
});
