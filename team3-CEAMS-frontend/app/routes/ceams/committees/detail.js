import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let committee = await this.store.findRecord('committee', params.committee_id);
    let members = await committee.get('members');
    let membersInfo = [];

    for (let i = 0; i < members.length; i++) {
      const m = members.objectAt(i);
      
      let info = await m.get('teachingAssistantMember') 
              || await m.get('instructorMember') 
              ||  await m.get('staffMember');
      membersInfo.push({
        name: info.firstName + " " + info.lastName,
        startDate: m.participationStartDate,
        endDate: m.participationEndDate || "Still participating"
      });
    }

    return {
      committee,
      membersInfo
    };
  }
});