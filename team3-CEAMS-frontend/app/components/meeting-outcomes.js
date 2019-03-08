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
            var outcome = this.get('DS').createRecord('meeting-outcome',{
                title: this.get('title'),
                description: this.get('resultDescription'),
                recommendations: this.get('recommendations'),
                decision: this.get('decision')
            });

            outcome.save().then(() => {
                return  true;
            })
        },   
    }
});
