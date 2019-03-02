import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
    DS: service('store'),

    actions:{
        create: function(){
            var newMeeting = this.get('DS').createRecord('meeting-minutes', {
                location: this.get('location'),
                description: this.get('description'),
                startDateTime: this.get('startDateTime'),
                endDateTime: this.get('endDateTime')
            });

            newMeeting.save().then(() => {
                return true;
            });
        },
        closeModal: function(){
            $('.ui.newMeeting.modal').modal('hide');
        },
        openModal: function () {
            this.set('location', null);
            this.set('description', null);
            this.set('startDatetime', null);
            this.set('endDateTime', null);
            
            $('.ui.newMeeting.modal').modal({
              closable: false,
      
              onDeny: () => {
                return true;
              },
      
              onApprove: () => {

              }
            })
            .modal('show');
        }
    }
});