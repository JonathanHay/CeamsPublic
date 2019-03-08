import Component from '@ember/component';

export default Component.extend({
    didRender(){
        this._super(...arguments);
    },
    actions:{
        // addToTable: function(){
        //     var outcome = {
        //         title: this.get('title'),
        //         description: this.get('resultDescription'),
        //         recommendations: this.get('recommendations'),
        //         decision: this.get('decision')
        //     };
        // },   
    }
});
