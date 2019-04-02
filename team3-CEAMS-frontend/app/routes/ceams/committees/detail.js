import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let committee = await this.store.findRecord('committee', params.committee_id);
    let members = await committee.get('members');
    let membersInfo = [];

    console.time('start');
    for (let i = 0; i < members.length; i++) {
      const m = members.objectAt(i);
      
      let info = await m.get('teachingAssistantMember') 
      || await m.get('instructorMember') 
      ||  await m.get('staffMember');
      
      try {
        membersInfo.push({
          name: info.firstName + " " + info.lastName,
          startDate: m.participationStartDate,
          endDate: m.participationEndDate || "Still participating"
        });
        
      } catch (error) {
        
      }
    }
    console.timeEnd('start');

    return {
      committee,
      membersInfo
    };
  }
});