import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('errors', []);
        this.set("comQuery", "");
    },
    committeeList: computed('allCommittees', 'comQuery', function () {
        var temp = this.get("allCommittees");
        var theQuery = this.get("comQuery");
        if (this.get("query") != "") {
            temp = temp.filter(function (item) { return (item.name.includes(theQuery)) });
        }
        return temp;
    }),
});
