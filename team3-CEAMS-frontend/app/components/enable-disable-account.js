import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
  store: service(),
  ID: null,

  actions: {
    assignStatus (){
      this.get('store').peekRecord('userAccount', this.get('ID')).then(function(updatedUser){
        if (updatedUser.get('enabled')) {
          updatedUser.set('enabled',false );
        } else {
          updatedUser.set('enabled',true );
        }
        updatedUser.save();
      });
    }
  }
});