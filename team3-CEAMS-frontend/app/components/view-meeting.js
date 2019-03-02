import Component from '@ember/component';
import {inject as service} from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    DS: service('store'),

    modalName: computed(function () {
        return 'newMeeting' + this.get('ID');
      }),

    actions:{
        userSubmit: function(changes){
            console.log(changes);
        },
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
        edit: function(){
            $('#editBtn').click(function() {
                $('.meetingInput').prop("readonly", false);
            });
        },
        closeModal: function(){
            $('.ui.' + this.get('modalName') +'.modal').modal('hide');
        },
        openModal: function () {
            /*
                instead of null, must put in onePost.meetingTitle.... 
                that is passed from template meeting
            */
           
           this.set('location', null);
           this.set('description', null);
           this.set('startDatetime', null);
           this.set('endDateTime', null);
            $('.ui.' + this.get('modalName') +'.modal').addClass('scrollME');
            $('.ui.' + this.get('modalName') +'.modal').modal({
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