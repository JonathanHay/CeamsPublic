import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({


  FEAT07_000IsPermitted: computed(function () {
    let authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT07_000") >= 0);
    }
  }),

  didInsertElement(){
    this._super(...arguments);
    $('#example').DataTable();
  }
});
