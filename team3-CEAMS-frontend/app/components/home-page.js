import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  routing: service('router'),

  actions: {
    login() {
      this.get('oudaAuth').set('isLoginRequested', true);
      this.get('routing').transitionTo('login');
    }
  }

});