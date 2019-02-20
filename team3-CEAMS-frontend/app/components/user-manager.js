import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('changes', {});
    this.set('allUsersFilter', '');
    this.set('membersFilter', '');
  },

  allUsers: computed('users.allUsers', 'users.members', 'allUsersFilter', function() {
    return this.users.allUsers.filter((u) => {
      return (u.firstName + " " + u.lastName).startsWith(this.get('allUsersFilter'));
    });
  }),
  
  members: computed('users.members', 'users.allUsers', 'membersFilter', function() {
    return this.users.members.filter((u) => {
      return (u.firstName + " " + u.lastName).startsWith(this.get('membersFilter'));
    });
  }),

  actions: {
    add(user) {
      let key = `changes.${user._id}`;
      if (this.get(key) == 'remove') {
        this.set(key, undefined); // if already on remove list, remove entry
      } else {
        this.set(key, 'add')
      }
      this.set('users.allUsers', this.get('users.allUsers').filter((u) => {
        return user._id != u._id;
      }));
      this.get('users.members').pushObject(user);
      this.set('allUsersFilter', '');
      this.set('membersFilter', '');
    },
    remove(user) {
      let key = `changes.${user._id}`;
      if (this.get(key) == 'add') {
        this.set(key, undefined); // if already on add list, remove entry
      } else {
        this.set(key, 'remove')
      }
      this.set('users.members', this.get('users.members').filter((u) => {
        return user._id != u._id;
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
      this.submit(this.get('changes'));
    }
  }
});
