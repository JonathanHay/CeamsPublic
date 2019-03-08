import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let teachingAssistants = (await this.store.findAll('teachingAssistant')).toArray();
    let staff = (await this.store.findAll('staff')).toArray();
    let instructors = (await this.store.findAll('instructor')).toArray();
    
    let userProfiles = [];
    teachingAssistants.forEach((e) => {
      e.type = 'teachingAssistantMember';
      userProfiles.push(e);
    })
    staff.forEach((e) => {
      e.type = 'staffMember';
      userProfiles.push(e);
    })
    instructors.forEach((e) => {
      e.type = 'instructorMember';
      userProfiles.push(e);
    })
    
    let allUsers = [];
    let members = [];

    userProfiles.forEach((e) => {
      let isMember = false;
      if (e.memberships.length > 0) {
        for (let i = 0; i < e.memberships.length; i++) {
          if (e.memberships[i].committee === params.committee_id) isMember = true;
        }
      }
      if (isMember) {
        members.push(e);
      } else {
        allUsers.push(e);
      }
    });

    return {
      users: {
        allUsers,
        members
      },
      cid: params.committee_id,
    };
  },
});