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
        async userSubmit(changes) {
          let meetingID = this.get('ID')
          console.log(changes);
          for (const uid in changes) {
            if (changes.hasOwnProperty(uid)) {
              const c = changes[uid];
              console.log(uid)
              if (c !== undefined) {
                if (c[0] === "add") {
                    console.log(uid)
                    console.log(meetingID)
                  let memberRecord =this.get('DS').peekRecord('committee-membership',uid);
                  let meetingRecord = this.get('DS').peekRecord('meeting', meetingID);

                  memberRecord.get('meetings').pushObject(meetingRecord);
                  memberRecord.save();
                  meetingRecord.get('attendees').pushObject(memberRecord);
                  meetingRecord.save();
                  
    
                } else if (c[0] === "remove") {
                  let m = await this.store.findRecord('committee-membership', memberships[uid], { backgroundReload: false });
                  await m.destroyRecord();
                }
              }
            }
          }
        },
        closeModal: function(){
            $('.ui.' + this.get('modalName') +'.modal').modal('hide');
        },
        openModal: function () {
            this.set('meetingData', this.get('DS').peekRecord('meeting', this.get('ID'), { include: 'meetingOutcomes, committeeMemberships'}));
            this.set('location', this.get('meetingData.location'));
            this.set('description',  this.get('meetingData.description'));
            this.set('minutes',  this.get('meetingData.minutes'));
            this.set('startDatetime',  this.get('meetingData.startDateTime'));
            this.set('endDateTime',  this.get('meetingData.endDateTime'));
            let members = this.get('members');
            let att = this.get('attendees');
            members.forEach((member)=>{
                member.memberships.forEach((m)=>{
                    att.forEach((a)=>{
                        if(a.id == m._id){
                            a.firstName = member.firstName;
                            a.lastName = member.lastName;
                            a.committeeName = member.committeeName;
                            a.type = member.type;
                        }
                    })
                });
            });
            this.set('attendees', att); 
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