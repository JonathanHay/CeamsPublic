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

    modalName: computed(function () {
        return 'newMeeting' + this.get('ID');
      }),

    didRender(){
        $( document ).ready(function() {
            // $('.cookie.nag')
            //     .nag('clear')
            // ;
        });
    },
    actions:{
        
        userSubmit: function(users){
            this.set('members', users)
        },
        update: function(){
            this.get('DS').findRecord('meeting', this.get('ID')).then((meeting) => {
                meeting.set('location', this.get('location'));
                meeting.set('description', this.get('description'));
                meeting.set('minutes', this.get('minutes'));
                meeting.set('startDateTime', this.get('startDateTime'));
                meeting.set('endDateTime', this.get('endDateTime'));
                meeting.save().then(() => {
                    $('.cookie.nag')
                        .nag('show')
                    ;
                }, (err)=>{
                    $('.cookie.nag.bad')
                        .nag('show')
                    ;
                });
            });
        },
        closeModal: function(){
            $('.ui.' + this.get('modalName') +'.modal').modal('hide');
        },
        openModal: function () {
            this.set('meetingData', this.get('DS').peekRecord('meeting', this.get('ID'), { include: 'meetingOutcomes, committeeMemberships'}));
            this.set('members', this.get('DS').findAll('committee-membership'));
            this.set('location', this.get('meetingData.location'));
            this.set('description',  this.get('meetingData.description'));
            this.set('minutes',  this.get('meetingData.minutes'));
            this.set('startDatetime',  this.get('meetingData.startDateTime'));
            this.set('endDateTime',  this.get('meetingData.endDateTime'));
            $('.ui.' + this.get('modalName') +'.modal').addClass('scrollME');
            $('.ui.' + this.get('modalName') +'.modal').modal({
              closable: false,
      
              onDeny: () => {
                return true;
              },
      
              onApprove: () => {
                return true;
              }
            })
            .modal('show');
        }
    }
});