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
    outcomes: null,
    //attendees nested
    attendees: null,

    memberships:null,

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
        // async userSubmit(changes) {
        //   let meetingID = this.get('ID')
        //   console.log(changes);
        //   for (const uid in changes) {
        //     if (changes.hasOwnProperty(uid)) {
        //       const c = changes[uid];
        //       console.log(uid)
        //       if (c !== undefined) {
        //         // if (c[0] === "add") {
        //         //     console.log(uid)
        //         //     console.log(meetingID)
        //         //   let memberRecord =this.get('DS').peekRecord('committee-membership',uid);
        //         //   let meetingRecord = this.get('DS').peekRecord('meeting', meetingID);

        //         //   memberRecord.get('meetings').pushObject(meetingRecord);
        //         //   memberRecord.save();
        //         //   meetingRecord.get('attendees').pushObject(memberRecord);
        //         //   meetingRecord.save();
                  
    
        //         // } else if (c[0] === "remove") {
        //         //   let m = await this.store.findRecord('committee-membership', memberships[uid], { backgroundReload: false });
        //         //   await m.destroyRecord();
        //         // }
        //       }
        //     }
        //   }
        // },
        closeModal: function(){
            $('.ui.' + this.get('modalName') +'.modal').modal('hide');
        },
        openModal: function () {
            this.set('attendees', []);
            this.set('meetingData', this.get('DS').peekRecord('meeting', this.get('ID')));
            this.set('location', this.get('meetingData.location'));
            this.set('description',  this.get('meetingData.description'));
            this.set('minutes',  this.get('meetingData.minutes'));
            this.set('startDatetime',  this.get('meetingData.startDateTime'));
            this.set('endDateTime',  this.get('meetingData.endDateTime'));
            this.set('outcomes', this.get('meetingData.outcomes'));

            let memberInfo=[]
            let a = null;

            this.get('DS').findAll('committee-membership').then((members) => {
                members.forEach((member)=>{
                    member.get('instructorMember').then((e) => {
                        if(e != undefined){
                            this.get('DS').findRecord('committee', member.committee).then((committee)=>{
                                a = {
                                    firstName : e.firstName,
                                    lastName : e.lastName,
                                    memberID : member.id,
                                    committeeName : committee.name
                                }
                                memberInfo.push(a);
                                a=null;
                                this.set('memberships', memberInfo);
                            });
                        }
                    })
                    member.get('staffMember').then((e) => {
                        if(e != undefined){
                            this.get('DS').findRecord('committee', member.committee).then((committee)=>{
                                a = {
                                    firstName : e.firstName,
                                    lastName : e.lastName,
                                    memberID : member.id,
                                    committeeName : committee.name
                                }
                                memberInfo.push(a);
                                a=null;
                                this.set('memberships', memberInfo);
                            });
                        }
                    })
                    member.get('teachingAssistantMember').then((e) => {
                        if(e != undefined){
                            this.get('DS').findRecord('committee', member.committee).then((committee)=>{
                                a = {
                                    firstName : e.firstName,
                                    lastName : e.lastName,
                                    memberID : member.id,
                                    committeeName : committee.name
                                }
                                memberInfo.push(a);
                                a=null;
                                this.set('memberships', memberInfo);
                            });
                        }
                    })
                })
            })

            //variable for storing user info (fn, ln, cname)
            let attInfo = []
            /* 
            getting names and committeenames
            */
            let meetingRecord = this.get('DS').peekRecord('meeting', this.get('ID'));
            meetingRecord.get('attendees').then((attendeesArray) => {
                attendeesArray.forEach((attendee) => {
                    attendee.get('instructorMember').then((e) => {
                        if(e != undefined){
                            this.get('DS').findRecord('committee', attendee.committee).then((committee)=>{
                                a = {
                                    firstName : e.firstName,
                                    lastName : e.lastName,
                                    memberID : attendee.id,
                                    committeeName : committee.name
                                }
                                attInfo.push(a);
                                a=null;
                                this.set('attendees', attInfo);
                            });
                        }
                    })
                    attendee.get('staffMember').then((e) => {
                        if(e != undefined){
                            this.get('DS').findRecord('committee', attendee.committee).then((committee)=>{
                                a = {
                                    firstName : e.firstName,
                                    lastName : e.lastName,
                                    memberID : attendee.id,
                                    committeeName : committee.name
                                }
                                attInfo.push(a);
                                a=null;
                                this.set('attendees', attInfo);
                            });
                        }
                    })
                    attendee.get('teachingAssistantMember').then((e) => {
                        if(e != undefined){
                            this.get('DS').findRecord('committee', attendee.committee).then((committee)=>{
                                a = {
                                    firstName : e.firstName,
                                    lastName : e.lastName,
                                    memberID : attendee.id,
                                    committeeName : committee.name
                                }
                                attInfo.push(a);
                                a=null;
                                this.set('attendees', attInfo);
                            });
                        }
                    })
                })
            });
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