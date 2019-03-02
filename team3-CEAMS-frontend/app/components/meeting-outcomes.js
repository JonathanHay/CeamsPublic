import Component from '@ember/component';

export default Component.extend({
    didRender(){
        this._super(...arguments);
        //this.get('DS').findAll('meetingOutcomes')
    }
});
