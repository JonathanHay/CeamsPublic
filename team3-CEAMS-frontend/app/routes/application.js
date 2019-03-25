import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel () {
    let authentication = this.get('oudaAuth');
    authentication.set('isLoginRequested', false);
    let self = this;
    authentication.fetch().then(
      function () {
        self.transitionTo('home-page');
      },
      function () {
        self.transitionTo('home-page');
      });
  }
});
