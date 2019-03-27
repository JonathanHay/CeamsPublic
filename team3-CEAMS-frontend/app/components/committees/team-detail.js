import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({

  FEAT21_002IsPermitted: computed(function () { //manage ga task force or ga committee
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT21_002") >= 0);
    }
  }),
});
