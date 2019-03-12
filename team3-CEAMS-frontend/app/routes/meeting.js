import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
    model: function(){
      return RSVP.hash({
        meetings: this.store.findAll('meeting'),
        // allUsers: this.store.findAll('committee-membership')
      });
    }
});