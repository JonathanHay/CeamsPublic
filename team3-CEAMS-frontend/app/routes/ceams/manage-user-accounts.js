import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('oudaAuth').get('isAuthenticated')=== false) {
      this.transitionTo('home-page');
    }
  },

  model() {
    return this.get('store').findAll('userAccount',  { reload: true });

  },
  afterModel (){
    this.get('store').findAll('instructor',  { reload: true });
    this.get('store').findAll('staff',  { reload: true });
    this.get('store').findAll('teachingAssistant',  { reload: true });
  }
});
