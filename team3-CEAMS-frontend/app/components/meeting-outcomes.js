import Component from '@ember/component';
import {inject as service} from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    didRender(){
        this._super(...arguments);
    },
    DS: service('store'),
    actions:{
        addToTable: function(){
            var meetingID = this.get('DS').peekRecord('meeting', this.get('meetingId'));
            var meetingOutcome = this.get('DS').createRecord('meeting-outcome',{
                title: this.get('title'),
                description: this.get('resultDescription'),
                recommendations: this.get('recommendations'),
                decision: this.get('decision'),
                meeting: meetingID
            });

            meetingOutcome.save().then(() => {
                return  true;
            })
            this.set('title', null)
            this.set('resultDescription', null)
            this.set('recommendations', null) 
            this.set('decision', null)
        },   
    }
});
