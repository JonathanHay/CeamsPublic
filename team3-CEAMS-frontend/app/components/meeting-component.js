import Component from '@ember/component';
import {computed} from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        $('#example').DataTable();
    },
    FEAT22_000IsPermitted: computed(function(){ 
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_000") >= 0);
        }
    }),
    FEAT22_001IsPermitted: computed(function(){
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_001") >= 0);
        }
    }),
    FEAT22_002IsPermitted: computed(function(){
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_002") >= 0);
        }
    }),
    FEAT22_003IsPermitted: computed(function(){
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_003") >= 0);
        }
    }),
    FEAT22_004IsPermitted: computed(function(){
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_004") >= 0);
        }
    }),
});
