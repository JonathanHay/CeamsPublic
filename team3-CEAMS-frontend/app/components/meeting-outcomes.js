import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({   
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
    FEAT22_004IsPermitted: computed(function(){ //add decisions
      var authentication = this.get('oudaAuth');
      if (authentication.getName === "Root") {
        return true;
      } else {
        return (authentication.get('userCList').indexOf("FEAT22_004") >= 0);
      }
  }),
    DS: service('store'),
    didRender() {
      this._super(...arguments);
    },    
    actions: {
        addToTable: function () {
            var meetingID = this.get('DS').peekRecord('meeting', this.get('meetingId'));
            var meetingOutcome = this.get('DS').createRecord('meeting-outcome', {
                title: this.get('title'),
                description: this.get('resultDescription'),
                recommendations: this.get('recommendations'),
                decision: this.get('decision'),
                meeting: meetingID
            });

            meetingOutcome.save().then(() => {
                return true;
            })
            this.set('title', null)
            this.set('resultDescription', null)
            this.set('recommendations', null)
            this.set('decision', null)
        },
    }
});
