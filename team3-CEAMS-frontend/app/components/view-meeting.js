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
                    window.alert('Updated')
                },(err)=>{
                    window.alert('Error, please try again')
                });
                
            });
        },
        async submit(changes) {
          let meetingRecord = this.get('DS').peekRecord('meeting', this.get('ID'));        
          for(const memberID in changes){
            if (changes.hasOwnProperty(memberID)){
                const member = changes[memberID]
                console.log(member);
                if(member !== undefined){
                    //records for deleting and saving
                    let memberRecord = this.get('DS').peekRecord('committee-membership', member[1]);
                    if(member[0] === "add"){
                        memberRecord.get('meetings').pushObject(meetingRecord);
                        memberRecord.save();
                        meetingRecord.get('attendees').pushObject(memberRecord);

                    }else if(member[0] === "remove"){
                        memberRecord.get('meetings').removeObject(meetingRecord);
                        memberRecord.save();
                        meetingRecord.get('attendees').removeObject(memberRecord);
                    }
                    else{}
                }
            }
          }
          meetingRecord.save();

        },
        closeModal: function(){
            $('.ui.' + this.get('modalName') +'.modal').modal('hide');
        },
        removeDuplicates: function(){
            this.get('attendees').filter((a)=>{
                this.get('memberships').filter((m)=>{
                    if(m.memberID==a.memberID){
                    this.get('memberships').removeObject(m);
                    }
                })
            })
        },
        openModal: function () {
            this.set('attendees', []);
            this.set('meetingData', this.get('DS').peekRecord('meeting', this.get('ID')));
            this.set('location', this.get('meetingData.location'));
            this.set('description',  this.get('meetingData.description'));
            this.set('minutes',  this.get('meetingData.minutes'));
            this.set('endDateTime',  this.get('meetingData.endDateTime'));
            this.set('outcomes', this.get('meetingData.outcomes'));

            let date = new Date(this.get('meetingData.startDateTime'));
            console.log(date);
            this.set('startDateTime', date.toISOString().substring(0,10));

            let memberInfo=[]
            let a = null;

            this.get('DS').findAll('committee-membership').then((members) => {
                members.forEach((member)=>{
                    member.get('instructorMember').then((e) => {
                        if(e!=undefined){
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