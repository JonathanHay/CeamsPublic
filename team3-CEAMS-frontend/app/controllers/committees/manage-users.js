import Controller from '@ember/controller';

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
              let membership = this.store.createRecord('committee-membership', {
                role: "role",
                participationStartDate: new Date(),
                [c[1]]: uid,
                committee: committee_id
              });
              membership.save();
            } else if (c[0] === "remove") {
              let m = await this.store.findRecord('committee-membership', memberships[uid], { backgroundReload: false });
              await m.destroyRecord();
            }
          }
        }
      }
      location.reload();
    }
  }
});
