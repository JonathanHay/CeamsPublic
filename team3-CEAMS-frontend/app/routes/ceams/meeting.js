import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import {computed} from '@ember/object';


export default Route.extend({
    model: function(){
      return RSVP.hash({
        meetings: this.store.findAll('meeting')
      });
    },
    FEAT21_100IsPermitted: computed(function(){ //Manage meetings
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
});