import Component from '@ember/component';
import {computed} from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        $('#example').DataTable();
    },
    FEAT022_000IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT022_000") >= 0);
        }
    }),
    FEAT022_001IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT022_001") >= 0);
        }
    }),
    FEAT022_002IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT022_002") >= 0);
        }
    }),
    FEAT022_003IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT022_003") >= 0);
        }
    }),
    FEAT022_004IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT022_004") >= 0);
        }
    }),
});
