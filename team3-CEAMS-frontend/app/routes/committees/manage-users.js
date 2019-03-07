import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return Ember.RSVP.hash({
      allUsers: this.store.findAll('committee-membership'),
      members: this.store.findAll('committee')
    });
  },
});
