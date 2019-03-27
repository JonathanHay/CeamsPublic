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
        if (this.get("comQuery") != "") {
            temp = temp.filter(function (item) { return (item.name.includes(theQuery)) });
        }
        return temp;
    }),
    FEAT21_001IsPermitted: computed(function () { //Add committee
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
            return true;
        } else {
            return (authentication.get('userCList').indexOf("FEAT21_001") >= 0);
        }
    }),
    FEAT21_003IsPermitted: computed(function () { //Delete committee
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
            return true;
        } else {
            return (authentication.get('userCList').indexOf("FEAT21_003") >= 0);
        }
    }),
    FEAT21_004IsPermitted: computed(function () { //View committee
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
            return true;
        } else {
            return (authentication.get('userCList').indexOf("FEAT21_004") >= 0);
        }
    }),
});
