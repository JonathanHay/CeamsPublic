import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let committee = await this.store.findRecord('committee', params.committee_id);
    let members = await committee.get('members');
    let membersInfo = [];
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      let info = await m.get('teachingAssistantMember') 
              || await m.get('instructorMember') 
              ||  await m.get('staffMember');
      console.log(info);
    }
    return {
      committee,
      members
    };
  }
});
