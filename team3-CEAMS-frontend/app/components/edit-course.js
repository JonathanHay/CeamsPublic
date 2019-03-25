import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery';
import {oneWay} from '@ember/object/computed';
import {computed} from '@ember/object';

export default Component.extend({
  DS: service('store'),
  courseData: null,
  title: oneWay('courseData.title'),
  number: oneWay('courseData.number'),
  academicCredit: oneWay('courseData.academicCredit'),

  FEAT07_002IsPermitted: computed(function(){ //Delete course
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT07_002") >= 0);
    }
  }),

  modalName: computed(function () {
    return 'editPost' + this.get('ID');
  }),

  courseTypes:null,

  // init(){
  //   this._super(...arguments);
  //   this.set('courseData', this.get('DS').peekRecord('course', this.get('ID')));
  // },

  actions: {
    openModal: function () {
      this.set('courseData', this.get('DS').peekRecord('course', this.get('ID')));

      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        useFlex: false,


        onDeny: () => {
          return true;
        },
        onApprove: () => {
          this.get('DS').findRecord('course', this.get('ID')).then((rec) => {
            rec.set('title', this.get('title'));
            rec.set('number', this.get('number'));
            rec.set('academicCredit', this.get('academicCredit'));

            rec.save().then(() => {
              return true;
            });
          });
        }
      })
        .modal('show');
    }
  },
});
