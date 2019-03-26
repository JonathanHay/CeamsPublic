import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    didRender() {
        this._super(...arguments);
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
    DS: service('store'),
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
