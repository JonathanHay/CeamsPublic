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
    let memberships = [];

    for (let i = 0; i < userProfiles.length; i++) {
      const e = userProfiles[i];
      
      let userMemberships;
      try {
        userMemberships = (await e.get('memberships')).toArray();
      } catch (error) {
        continue;
      }
      
      let isMember = false;
      let membership = '';
      if (userMemberships.length > 0) {
        for (let i = 0; i < userMemberships.length; i++) {
          if (userMemberships[i].committee === params.committee_id) {
            isMember = true
            membership = userMemberships[i].id;
          };
        }
      }
      if (isMember) {
        members.push(e);
        memberships[e.id] = membership;
      } else {
        allUsers.push(e);
      }
    }

    return {
      users: {
        allUsers,
        members,
        memberships
      },
      cid: params.committee_id,
    };
  },
});