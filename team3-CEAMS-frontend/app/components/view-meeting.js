import Component from '@ember/component';
import {inject as service} from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';
import committeeMembership from '../models/committee-membership';

export default Component.extend({
    DS: service('store'),
    meetingData:null,

    modalName: computed(function () {
        return 'newMeeting' + this.get('ID');
      }),

    actions:{
        addToTable: function(){
            var outcome = {
                title: this.get('title'),
                description: this.get('resultDescription'),
                recommendations: this.get('recommendations'),
                decision: this.get('decision')
            };
            this.get('outcomes').pushObject(outcome);
        },
        userSubmit: function(users){
            this.set('users', users)
        },
        create: function(){
            var newMeeting = this.get('DS').createRecord('meeting', {
                location: this.get('location'),
                description: this.get('description'),
                startDateTime: this.get('startDateTime'),
                endDateTime: this.get('endDateTime'),

                committeeMembership: this.get('users'),
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
            /*
                instead of null, must put in onePost.meetingTitle.... 
                that is passed from template meeting
            */
            this.set('meetingData', this.get('DS').findRecord('meeting', this.get('ID'), { include: 'meetingOutcomes'}));

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