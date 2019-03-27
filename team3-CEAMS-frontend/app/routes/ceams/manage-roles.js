import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('oudaAuth').get('isAuthenticated')=== false) {
      this.transitionTo('home-page');
    }
  },

  model() {
    return this.get('store').findAll('role',  { reload: true });

  }
  ,

  afterModel (){
    this.get('store').findAll('permission',  { reload: true });
    this.get('store').findAll('capability',  { reload: true });
  }
});
