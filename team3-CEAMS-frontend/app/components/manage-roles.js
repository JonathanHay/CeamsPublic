import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';



export default Component.extend({
  isEditing: false,
  store: service(),


  // capabilityModel: computed(function () {
  //   return this.get('store').findAll('capability');
  // }),

  FEAT28_008IsPermitted: computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_008") >= 0);
    }
  }),


});