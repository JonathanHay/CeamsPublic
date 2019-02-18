import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    DS: service('store'),

    actions:{
        edit: function(){
            $('#editBtn').click(function() {
                $('.meetingInput').prop("readonly", false);
            });
        },
        openModal: function () {
            /*
                instead of null, must put in onePost.meetingTitle.... 
                that is passed from template meeting
            */
           
            this.set('meetingTitle', null);
            this.set('meetingPlace', null);
            this.set('meetingObjective', null);
            this.set('meetingDescription', null);
            this.set('otherDetail', null);
            this.set('recommendations', null);
            this.set('decisions', null);
            $('.ui.viewMeeting.modal').modal({
              closable: false,
      
              onDeny: () => {
                return true;
              },
      
              onApprove: () => {
                var newMeetingMinute = this.get('DS').createRecord('meeting-minutes', {
                    meetingTitle: this.get('meetingTitle'),
                    meetingPlace: this.get('meetingPlace'),
                    meetingObjective: this.get('meetingObjective'),
                    meetingDescription: this.get('meetingDescription'),
                    otherDetail:this.get('otherDetail'),
                    recommendations: this.get('recommendations'),
                    decisions: this.get('decisions')
                });
    
                newMeetingMinute.save().then(() => {
                    return true;
                });
    
                var newMeeting = this.get('DS').createRecord('meetings', {
                    startDateTime: this.get('startDateTime'),
                    endDateTime: this.get('endDateTime')
                });
    
                newMeeting.save().then(() => {
                    return true;
                });
              }
            })
            .modal('show');
        }
    }
});
