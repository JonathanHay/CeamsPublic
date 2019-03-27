import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('changes', {});
        this.set('allUsersFilter', '');
        this.set('membersFilter', '');
    },

    FEAT021_000IsPermitted: computed(function(){ // Manage GA Task Force
      var authentication = this.get('oudaAuth');
      if (authentication.getName === "Root") {
        return true;
      } else {
        return (authentication.get('userCList').indexOf("FEAT021_000") >= 0);
      }
    }),

    allUsers: computed('users.allUsers', 'users.members', 'allUsersFilter', function () {
        return this.users.allUsers.filter((u) => {
            return (u.firstName + " " + u.lastName).startsWith(this.get('allUsersFilter'));
        });
    }),

    members: computed('users.members', 'users.allUsers', 'membersFilter', function () {
        return this.users.members.filter((u) => {
            return (u.firstName + " " + u.lastName).startsWith(this.get('membersFilter'));
        });
    }),

    isChanges: computed('changes', 'users.members', 'users.allUsers', function() {
      let changes = this.get('changes');
      for (const key in changes) {
        if (changes.hasOwnProperty(key)) {
          const c = changes[key];
          if (c === undefined) delete changes[key];
        }
      }
      this.set('changes', changes);
      return Object.keys(this.get('changes')).length > 0;
    }),

    actions: {
        add(user) {
            let key = `changes.${user.id}`;
            if (this.get(key) !== undefined && this.get(key)[0] === 'remove') {
                this.set(key, undefined); // if already on remove list, remove entry
            } else {
                this.set(key, ['add', user.type])
            }
            this.set('users.allUsers', this.get('users.allUsers').filter((u) => {
                return user.id != u.id;
            }));
            this.get('users.members').pushObject(user);
            this.set('allUsersFilter', '');
            this.set('membersFilter', '');
        },
        remove(user) {
            let key = `changes.${user.id}`;
            if (this.get(key) !== undefined && this.get(key)[0] === 'add') {
                this.set(key, undefined); // if already on add list, remove entry
            } else {
                this.set(key, ['remove', user.type])
            }
            this.set('users.members', this.get('users.members').filter((u) => {
                return user.id != u.id;
            }));
            this.get('users.allUsers').pushObject(user);
        },
        filterAllUsers(e) {
            this.set('allUsersFilter', e.target.value);
        },
        filtermembers(e) {
            this.set('membersFilter', e.target.value);
        },
        submit() {
          this.submit(this.committee_id, this.get('changes'), this.users.memberships);
          this.set('changes', {});
        }
    }
});