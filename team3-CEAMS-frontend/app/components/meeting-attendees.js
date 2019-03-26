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

    // attendees: computed('attendees', 'memberships', 'attendeesFilter', function() {
    //   return this.attendees.filter((u) => {
    //     return (u.firstName + " " + u.lastName).startsWith(this.get('attendeesFilter'));
    //   });
    // }),

    // memberships: computed('memberships', 'attendees', 'membershipsFilter', function() {
    //   return this.memberships.filter((u) => {
    //     return (u.firstName + " " + u.lastName).startsWith(this.get('membershipsFilter'));
    //   });
    // }),

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
