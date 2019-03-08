import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
    name: DS.attr(),
    level: DS.attr(),
    dateCreated: DS.attr(),
    members: DS.attr(),

    membersInfo: computed('members', function() {
      let info = [];

      for (let i = 0; i < this.members.length; i++) {
        const m = this.members[i];
        
        let memberInfo = {};
        
        let memberType = "";
        if (m.teachingAssistantMember != null) {
          memberType = "teachingAssistantMember";
        } else if (m.staffMember != null) {
          memberType = "staffMember";
        } else if (m.instructorMember != null) {
          memberType = "instructorMember";
        }

        memberInfo.name = m[memberType].firstName + " " + m[memberType].lastName;
        memberInfo.participationStartDate = new Date(m.participationStartDate).toDateString();
        memberInfo.participationEndDate = m.participationEndDate !== null ? new Date(m.participationEndDate).toDateString() : "Still participating";

        info.push(memberInfo);
      }

      return info;
    })
});