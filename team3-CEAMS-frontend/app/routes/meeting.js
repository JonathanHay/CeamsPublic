import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
    model: function(){
      return RSVP.hash({
        meetings: this.store.findAll('meeting')
      });
    }
});
  // async model() {
  // //   let committees = (await this.store.findAll('committee')).toArray();
  // //   let committeeMemberships = (await this.store.findAll('committee-membership')).toArray();
  //   let meetings = (await this.store.findAll('meeting')).toArray();
  // //   let teachingAssistants = (await this.store.findAll('teachingAssistant')).toArray();
  // //   let staff = (await this.store.findAll('staff')).toArray();
  // //   let instructors = (await this.store.findAll('instructor')).toArray();
    
  // //   let userProfiles = [];
  // //   teachingAssistants.forEach((e) => {
  // //     e.type = 'teachingAssistantMember';
  // //     userProfiles.push(e);
  // //   })
  // //   staff.forEach((e) => {
  // //     e.type = 'staffMember';
  // //     userProfiles.push(e);
  // //   })
  // //   instructors.forEach((e) => {
  // //     e.type = 'instructorMember';
  // //     userProfiles.push(e);
  // //   })
    
  // //   let members = [];

  // //   userProfiles.forEach((user) => {
  // //     if (user.memberships.length > 0) {
  // //       for(let i = 0; i < user.memberships.length; i++){
  // //         let ID = user.memberships[i]._id;
  // //         let committeeRecord = this.store.peekRecord('committee-membership',ID);
  // //         let cID = committeeRecord.get('committee')
  // //         let committee = this.store.peekRecord('committee', cID);
  // //         let cName = committee.get('name')
  // //         user.cID = ID;
  // //         user.committeeName = cName;
  // //         members.push(user);
  // //       }
  // //     };
  // //   });

  //   return {
  //     meetings: meetings
  //   };
  // },