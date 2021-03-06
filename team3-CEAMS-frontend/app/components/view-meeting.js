import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    DS: service('store'),
    //all data from meeting
    meetingData: null,
    //outcomes nested
    outcomes: null,
    //attendees nested
    attendees: null,

    memberships: null,

    modalName: computed(function () {
        return 'newMeeting' + this.get('ID');
    }),
    FEAT21_100IsPermitted: computed(function(){ //Manage meetings
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT21_100") >= 0);
        }
    }),
    FEAT21_101IsPermitted: computed(function(){ //Add new meetings
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT21_101") >= 0);
        }
    }),
    FEAT21_102IsPermitted: computed(function(){ //View meetings
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT21_102") >= 0);
        }
    }),
    FEAT22_001IsPermitted: computed(function(){ //add decisions
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_001") >= 0);
        }
    }),
    FEAT22_004IsPermitted: computed(function(){ //add decisions
      var authentication = this.get('oudaAuth');
      if (authentication.getName === "Root") {
        return true;
      } else {
        return (authentication.get('userCList').indexOf("FEAT22_004") >= 0);
      }
  }),

    actions: {
        userSubmit: function (users) {
            this.set('members', users)
        },
        update: function () {
            let startDate = this.get('startDate').split('-');
            let startTime = this.get('startTime').split(':');
            let month = parseInt(startDate[1]);
            if (month == 0) {
                month = 11;
            } else {
                month -= 1;
            }
            startDate[1] = month.toString();
            let finalStartDate = new Date(startDate[0], startDate[1], startDate[2], startTime[0], startTime[1]);

            let endDate = this.get('endDate').split('-');
            let endTime = this.get('endTime').split(':');
            let endMonth = parseInt(endDate[1]);
            if (endMonth == 0) {
                endMonth = 11;
            } else {
                endMonth -= 1;
            }
            endDate[1] = endMonth.toString();
            let finalEndDate = new Date(endDate[0], endDate[1], endDate[2], endTime[0], endTime[1]);

            this.get('DS').findRecord('meeting', this.get('ID')).then((meeting) => {
                meeting.set('location', this.get('location'));
                meeting.set('description', this.get('description'));
                meeting.set('minutes', this.get('minutes'));
                meeting.set('startDateTime', finalStartDate);
                meeting.set('endDateTime', finalEndDate);
                meeting.save().then(() => {
                    window.alert('Updated')
                }, (err) => {
                    window.alert('Error, please try again')
                });

            });
        },
        async submit(changes) {
            let meetingRecord = this.get('DS').peekRecord('meeting', this.get('ID'));
            for (const memberID in changes) {
                if (changes.hasOwnProperty(memberID)) {
                    const member = changes[memberID]
                    if (member !== undefined) {
                        //records for deleting and saving
                        let memberRecord = this.get('DS').peekRecord('committee-membership', member[1]);
                        if (member[0] === "add") {
                            memberRecord.get('meetings').pushObject(meetingRecord);
                            memberRecord.save();
                            meetingRecord.get('attendees').pushObject(memberRecord);

                        } else if (member[0] === "remove") {
                            memberRecord.get('meetings').removeObject(meetingRecord);
                            memberRecord.save();
                            meetingRecord.get('attendees').removeObject(memberRecord);
                        }
                        else { }
                    }
                }
            }
            meetingRecord.save();

        },
        closeModal: function () {
            $('.ui.' + this.get('modalName') + '.modal').modal('hide');
        },
        removeDuplicates: function () {
            this.get('attendees').filter((a) => {
                this.get('memberships').filter((m) => {
                    if (m.memberID == a.memberID) {
                        this.get('memberships').removeObject(m);
                    }
                })
            })
        },
        openModal: function () {
            this.set('attendees', []);
            this.set('meetingData', this.get('DS').peekRecord('meeting', this.get('ID')));
            this.set('location', this.get('meetingData.location'));
            this.set('description', this.get('meetingData.description'));
            this.set('minutes', this.get('meetingData.minutes'));
            this.set('outcomes', this.get('meetingData.outcomes'));

            let startDate = new Date(this.get('meetingData.startDateTime'));
            startDate.setHours(startDate.getHours() - 4)
            this.set('startDate', startDate.toISOString().substring(0, 10));
            this.set('startTime', startDate.toISOString().substring(11, 16));

            let endDate = new Date(this.get('meetingData.endDateTime'));
            endDate.setHours(endDate.getHours() - 4)
            this.set('endDate', endDate.toISOString().substring(0, 10));
            this.set('endTime', endDate.toISOString().substring(11, 16));

            let memberInfo = []
            let a = null;

            let members = this.get('DS').peekAll('committee-membership');
            members.forEach((member) => {
                member.get('instructorMember').then((e) => {
                    if (e != undefined && e!= null) {
                        let committee = this.get('DS').peekRecord('committee', member.committee);
                            a = {
                                firstName: e.firstName,
                                lastName: e.lastName,
                                memberID: member.id,
                                committeeName: committee.get('name')
                            }
                            memberInfo.push(a);
                            a = null;
                            this.set('memberships', memberInfo);
                    }
                })
                member.get('staffMember').then((e) => {
                    if (e != undefined && e!= null) {
                        let committee = this.get('DS').peekRecord('committee', member.committee);
                            a = {
                                firstName: e.firstName,
                                lastName: e.lastName,
                                memberID: member.id,
                                committeeName: committee.get('name')
                            }
                            memberInfo.push(a);
                            a = null;
                            this.set('memberships', memberInfo);
                    }
                })
                member.get('teachingAssistantMember').then((e) => {
                    if (e != undefined && e!= null) {
                        let committee = this.get('DS').peekRecord('committee', member.committee);
                            a = {
                                firstName: e.firstName,
                                lastName: e.lastName,
                                memberID: member.id,
                                committeeName: committee.get('name')
                            }
                            memberInfo.push(a);
                            a = null;
                            this.set('memberships', memberInfo);
                    }
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
                        if (e != undefined  && e!= null) {
                            let committee = this.get('DS').peekRecord('committee', attendee.committee);
                            a = {
                                firstName: e.firstName,
                                lastName: e.lastName,
                                memberID: attendee.id,
                                committeeName: committee.get('name')
                            }
                            attInfo.push(a);
                            a = null;
                            this.set('attendees', attInfo);
                        }
                    })
                    attendee.get('staffMember').then((e) => {
                        if (e != undefined  && e!= null) {
                            let committee = this.get('DS').peekRecord('committee', attendee.committee);
                                a = {
                                    firstName: e.firstName,
                                    lastName: e.lastName,
                                    memberID: attendee.id,
                                    committeeName: committee.get('name')
                                }
                                attInfo.push(a);
                                a = null;
                                this.set('attendees', attInfo);
                        }
                    })
                    attendee.get('teachingAssistantMember').then((e) => {
                        if (e != undefined  && e!= null) {
                            let committee = this.get('DS').peekRecord('committee', attendee.committee);
                                a = {
                                    firstName: e.firstName,
                                    lastName: e.lastName,
                                    memberID: attendee.id,
                                    committeeName: committee.get('name')
                                }
                                attInfo.push(a);
                                a = null;
                                this.set('attendees', attInfo);
                        }
                    })
                })
            });

            $('.ui.' + this.get('modalName') + '.modal').addClass('scrollME');
            $('.ui.' + this.get('modalName') + '.modal').modal({
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
