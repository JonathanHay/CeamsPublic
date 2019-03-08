import Component from '@ember/component';
import {inject as service} from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    DS: service('store'),
    //all data from meeting
    meetingData: null,
    //outcomes nested
    outcomes: oneWay('meetingData.outcomes'),
    //attendees nested
    attendees: oneWay('meetingData.attendees'),
    //all data from committeeMembership
    members:null,
    role: oneWay('meeting'),
    //types of user
    // instructor: oneWay('members.instructor'),
    // staff: oneWay('members.staff'),
    // teachingAssistant: oneWay('members.teachingAssistant'),

    modalName: computed(function () {
        return 'newMeeting' + this.get('ID');
      }),

    actions:{
        
        userSubmit: function(users){
            this.set('members', users)
        },
        create: function(){
            var newMeeting = this.get('DS').createRecord('meeting', {
                location: this.get('location'),
                description: this.get('description'),
                startDateTime: this.get('startDateTime'),
                endDateTime: this.get('endDateTime'),
                committeeMemberships: this.get('attendees'),
                meetingOutcomes: this.get('outcomes')
            });

            newMeeting.save().then(() => {
                return true;
            });
        },
        closeModal: function(){
            $('.ui.' + this.get('modalName') +'.modal').modal('hide');
        },
        openModal: function () {
            this.set('meetingData', this.get('DS').findRecord('meeting', this.get('ID'), { include: 'meetingOutcomes, committeeMemberships'}));
            this.set('members', this.get('DS').findAll('committee-membership'));
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