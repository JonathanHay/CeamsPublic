import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    console.log(params);
    return this.store.findRecord('committee', params.committee_id);
  }
});
