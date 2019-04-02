import Component from '@ember/component';
import {computed} from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        $('#example').DataTable();
    },   
    DS: service('store'),
    didRender(){
        this.get('DS').findAll('committee');
        this.get('DS').findAll('committee-membership')
        this.get('DS').findAll('teaching-assistant')
        this.get('DS').findAll('instructor')
        this.get('DS').findAll('staff')
    },
  FEAT21_100IsPermitted: computed(function () { //manage meetings
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT21_100") >= 0);
    }
  }),
  FEAT21_101IsPermitted: computed(function(){ //Add new meetings
      var authentication = this.get('oudaAuth');
      if (authentication.getName === "Root") {
        return true;
      } else {
        return (authentication.get('userCList').indexOf("FEAT21_101") >= 0);
      }
  }),
  FEAT21_102IsPermitted: computed(function(){ //View meetings
      var authentication = this.get('oudaAuth');
      if (authentication.getName === "Root") {
        return true;
      } else {
        return (authentication.get('userCList').indexOf("FEAT21_102") >= 0);
      }
  }),
  FEAT22_001IsPermitted: computed(function(){ //add decisions
      var authentication = this.get('oudaAuth');
      if (authentication.getName === "Root") {
        return true;
      } else {
        return (authentication.get('userCList').indexOf("FEAT22_001") >= 0);
      }
  }),
  FEAT22_002IsPermitted: computed(function(){ //add decisions
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT22_002") >= 0);
    }
}),
});
