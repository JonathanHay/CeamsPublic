import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
    DS: service('store'),

    actions:{
        //create new meetingMinute and meeting
        create: function(){
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
