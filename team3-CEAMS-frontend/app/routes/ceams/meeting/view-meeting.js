import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let attInfo = [];
    let meeting = await this.store.findRecord('meeting', params.meeting_id);
    let commiteeMemberships = await this.store.findAll('committee-membership');
    commiteeMemberships.forEach( async(member) => {
        console.log(member);
        let instructor = await member.get('instructorMember');
        let staff = await member.get('staffMember');
        let assitant = await member.get('teachingAssistantMember');
        if(instructor !=undefined){
            let committee  = await this.store.findRecord('committee', instructor.committee);
            a = {
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                memberID: member.id,
                committeeName: committee.name
            }
            attInfo.push(a);
        }

        if(staff !=undefined){
            let committee  = await this.store.findRecord('committee', staff.committee);
            a = {
                firstName: staff.firstName,
                lastName: staff.lastName,
                memberID: member.id,
                committeeName: committee.name
            }
            attInfo.push(a);
        }

        if(assitant !=undefined){
            let committee  = await this.store.findRecord('committee', assitant.committee);
            a = {
                firstName: assitant.firstName,
                lastName: assitant.lastName,
                memberID: member.id,
                committeeName: committee.name
            }
            attInfo.push(a);
        }
    });
    console.log(attInfo);
    return {
        meeting,
        attInfo
    };
  }
});