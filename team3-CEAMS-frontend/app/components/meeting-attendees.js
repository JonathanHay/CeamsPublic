import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
    DS: service('store'),

    init() {
        this._super(...arguments);
        this.set('changes', {});
        this.set('membershipsFilter', '');
        this.set('attendeesFilter', '');
    },   
     FEAT22_000IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_000") >= 0);
        }
    }),
    FEAT21_100IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_000") >= 0);
        }
    }),
    FEAT22_001IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_001") >= 0);
        }
    }),
    FEAT22_002IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_002") >= 0);
        }
    }),
    FEAT22_003IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_003") >= 0);
        }
    }),
    FEAT22_004IsPermitted: computed(function(){ //Delete course
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("FEAT22_004") >= 0);
        }
    }),

    attendeesList: computed('attendees', 'attendeesFilter', {
        get(key) {
            if(this.get('attendeesFilter') === ""){
                return this.attendees;
            } else{
                return this.attendees.filter((u) => {
                    return (u.firstName + " " + u.lastName).startsWith(this.get('attendeesFilter'));
                })
            }
        },
        set(key, value) {
          return value;
        }
      }),

    membershipsList: computed('memberships', 'membershipsFilter', {
        get(key) {
            if(this.get('membershipsFilter') === ""){
                return this.memberships;
            } else{
                return this.memberships.filter((u) => {
                    return (u.firstName + " " + u.lastName).startsWith(this.get('membershipsFilter'));
                })
            }
        },
        set(key, value) {
          return value;
        }
      }),

    actions: {
        add(user) {
            let key = `changes.${user.memberID}`;
            if (this.get(key) !== undefined && this.get(key)[0] === 'remove') {
                this.set(key, undefined); // if already on remove list, remove entry
            } else {
                this.set(key, ['add', user.memberID])
            }
            this.set('memberships', this.get('memberships').filter((u) => {
                return user.memberID != u.memberID;
            }));
            this.get('attendees').pushObject(user);
            this.set('membershipsFilter', '');
            this.set('attendeesFilter', '');
        },
        remove(user) {
            let key = `changes.${user.memberID}`;
            if (this.get(key) !== undefined && this.get(key)[0] === 'add') {
                this.set(key, undefined); // if already on add list, remove entry
            } else {
                this.set(key, ['remove', user.memberID])
            }
            this.set('attendees', this.get('attendees').filter((u) => {
                return user.memberID != u.memberID;
            }));
            this.get('memberships').pushObject(user);
        },
        filterMemberships(e) {
            this.set('membershipsFilter', e.target.value);
        },
        filterAttendees(e) {
            this.set('attendeesFilter', e.target.value);
        },
        submit() {
            this.submit(this.get('changes'));
            this.set('changes', {});
        }
    }
});
