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
        //create a new meetingMinutes and meeting
        create: function(){
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
    }
});
