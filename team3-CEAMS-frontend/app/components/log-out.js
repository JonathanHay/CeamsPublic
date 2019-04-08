import Component from '@ember/component';
import { inject as service } from '@ember/service';


export default Component.extend({
  routing: service('router'),
  store: service(),
  name: null,

  tagName: '',

  actions: {
    logout(){
      this.get('oudaAuth').close(this.get('oudaAuth').getName);
      this.get('routing').transitionTo('home-page');
    }
  }
});