import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
    DS: service('store'),

    actions:{
        closeModal: function(){
            $('.ui.newMeeting.modal').modal('hide');
        },
        openModal: function () {
            this.set('meetingTitle', null);
            this.set('meetingPlace', null);
            this.set('meetingObjective', null);
            this.set('meetingDescription', null);
            this.set('otherDetail', null);
            this.set('startDatetime', null);
            this.set('endDateTime', null);
            
            $('.ui.newMeeting.modal').modal({
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
                    otherDetail:this.get('otherDetail')
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
        },
        create: function () {
            var newMeetingMinute = this.get('DS').createRecord('meeting-minutes', {
                meetingTitle: this.get('meetingTitle'),
                meetingPlace: this.get('meetingPlace'),
                meetingObjective: this.get('meetingObjective'),
                meetingDescription: this.get('meetingDescription'),
                otherDetail:this.get('otherDetail')
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
    }
});