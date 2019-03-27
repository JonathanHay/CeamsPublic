import Component from '@ember/component';
import {computed} from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({

    FEAT021_000IsPermitted: computed(function(){ //manage ga task force or ga committee
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT021_000") >= 0);
        }
    }),
});
