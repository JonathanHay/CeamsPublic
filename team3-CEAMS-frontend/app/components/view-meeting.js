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
            this.set('meetingData', this.get('DS').peekRecord('meeting', this.get('ID')));
            this.set('location', this.get('meetingData.location'));
            this.set('description',  this.get('meetingData.description'));
            this.set('minutes',  this.get('meetingData.minutes'));
            this.set('startDatetime',  this.get('meetingData.startDateTime'));
            this.set('endDateTime',  this.get('meetingData.endDateTime'));
            this.set('outcomes', this.get('meetingData.outcomes'));
            let attInfo = []

            let meetingRecord = this.get('DS').peekRecord('meeting', this.get('ID'));
            meetingRecord.get('attendees').then((attendeesArray)=>{
                attendeesArray.forEach((attendee)=>{
                    let instructorMember = attendee.get('instructorMember').then((e)=>{
                        console.log(e.id)
                        return e
                    })
                    
                    if(instructorMember != undefined){
                        // console.log(instructorMember.id)
                    }

                    

                })
            });
            // })
            // attendeesArray.forEach((attendee)=>{
            //   if(attendee.get('instructorMember')!= undefined){
            //     this.get('DS').findRecord('instructor', attendee.get('instructorMember')).then((user)=>{
            //       let a = {}
            //       a.firstName = user.firstName;
            //       a.lastName = user.lastName;
            //       a.id = attendee.id;
            //       console.log(user);
            //       this.get('DS').findRecord('committee', attendee.committee).then((committee)=>{
            //         a.commiteeName =committee.name;
            //       })
            //       attInfo.push(a);
            //     })

            //   }else if(attendee.get('staffMember') != undefined){
            //     this.get('DS').findRecord('staff', attendee.get('staffMember')).then((user)=>{
            //         let a = {}
            //         a.firstName = user.firstName;
            //         a.lastName = user.lastName;
            //         a.id = attendee.id;
            //         console.log(user);
            //         this.get('DS').findRecord('committee', attendee.committee).then((committee)=>{
            //           a.commiteeName =committee.name;
            //         })
            //         attInfo.push(a);
            //       })
        
            //   }else if(attendee.attendee.get('teachingAssistantMember') != undefined){
            //     this.get('DS').findRecord('teaching-assistant', attendee.get('teachingAssistantMember')).then((user)=>{
            //         let a = {}
            //         a.firstName = user.firstName;
            //         a.lastName = user.lastName;
            //         a.id = attendee.id;
            //         console.log(user);
            //         this.get('DS').findRecord('committee', attendee.committee).then((committee)=>{
            //           a.commiteeName =committee.name;
            //         })
            //         attInfo.push(a);
            //       })
        
            //   }else{}
            // });

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