import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  DS: service('store'),

  actions: {
    openModal: function () {

      this.set('title', null);
      this.set('number', null);
      this.set('academicCredit', null);
      $('.ui.newCourse.modal').modal({
        closable: false,
        useFlex: false,

        onDeny: () => {
          return true;
        },

        onApprove: () => {
          var newCourse = this.get('DS').createRecord('course', {
            title: this.get('title'),
            number: this.get('number'),
            academicCredit: this.get('academicCredit'),
          });
          newCourse.save().then(() => {
            return true;
          });
        }
      })
        .modal('show');
    },
  }
});

