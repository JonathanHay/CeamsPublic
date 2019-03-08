import Controller from '@ember/controller';

export default Controller.extend({
  init() {
    this._super(...arguments);
  },
  actions: {
    processChanges(committee_id, changes) {
      for (const uid in changes) {
        if (changes.hasOwnProperty(uid)) {
          const c = changes[uid];

          if (c[0] === "add") {
            let membership = this.store.createRecord('committee-membership', {
              role: "role",
              participationStartDate: new Date(),
              [c[1]]: uid,
              committee: committee_id
            });
            membership.save();
          }
        }
      }
    }
  }
});
