import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  routing: service('router'),
  error: null,

  errorMessage: computed('error', function () {
    return this.get('error');
  }),


  actions: {
    login() {

// we do not authenticate user until feature ?? is implemented
      this.get('routing').transitionTo('main-menu');
    }
  }
});
