import Controller from '@ember/controller';
import $ from 'jquery';

const modelMap = {
  teachingAssistantMember: 'teaching-assistant',
  instructorMember: 'instructor',
  staffMember: 'staff',
};

export default Controller.extend({
  init() {
    this._super(...arguments);
  },
  actions: {
    async processChanges(committee_id, changes, memberships) {
      for (const uid in changes) {
        if (changes.hasOwnProperty(uid)) {
          const c = changes[uid];
          if (c !== undefined) {
            if (c[0] === "add") {
              let member = await this.store.findRecord(modelMap[c[1]], uid);
              let membership = this.store.createRecord('committee-membership', {
                role: "role",
                participationStartDate: new Date(),
                [c[1]]: member,
                committee: committee_id
              });
              await membership.save();
            } else if (c[0] === "remove") {
              let m = await this.store.findRecord('committee-membership', memberships[uid], { backgroundReload: false });
              await m.destroyRecord();
            }
          }
        }
      }
    }
  }
});
