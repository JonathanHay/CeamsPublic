import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    DS: service('store'),

    actions: {
        create: function () {
            var newMeeting = this.get('DS').createRecord('meeting', {
                location: this.get('location'),
                description: this.get('description'),
                minutes: this.get('minutes'),
                startDateTime: this.get('startDateTime'),
                endDateTime: this.get('endDateTime')
            });

            newMeeting.save().then(() => {
                return true;
            });
        },
        closeModal: function () {
            $('.ui.newModal.modal').modal('hide');
        },
        openModal: function () {
            this.set('location', null);
            this.set('description', null);
            this.set('startDatetime', null);
            this.set('endDateTime', null);

            $('.ui.newModal.modal').modal({
                closable: false,

                onDeny: () => {
                    return true;
                },

                onApprove: () => {

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
                otherDetail: this.get('otherDetail')
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