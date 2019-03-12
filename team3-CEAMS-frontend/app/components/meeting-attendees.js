import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('changes', {});
    this.set('membersFilter', '');
    this.set('attendeesFilter', '');
  },

  attendees: computed('attendees', 'members', 'attendeesFilter', function() {
    return this.attendees.filter((u) => {
      return (u.firstName + " " + u.lastName).startsWith(this.get('attendeesFilter'));
    });
  }),
  
  members: computed('members', 'attendees', 'membersFilter', function() {
    return this.members.filter((u) => {
      return (u.firstName + " " + u.lastName).startsWith(this.get('membersFilter'));
    });
  }),

  actions: {
    add(user) {
      this.set('attendees', this.get('attendees').filter((u) => {
        return user.id != u.id;
      }));
      let key = `changes.${user.cID}`;
      if (this.get(key) !== undefined && this.get(key)[0] === 'remove') {
        this.set(key, undefined); // if already on remove list, remove entry
      } else {
        this.set(key, ['add', user.type])
      }
      this.set('members', this.get('members').filter((u) => {
        return user.id != u.id;
      }));
      this.get('attendees').pushObject(user);
      this.set('membersFilter', '');
      this.set('attendeesFilter', '');
    },
    remove(user) {
      let key = `changes.${user.id}`;
      if (this.get(key) !== undefined && this.get(key)[0] === 'add') {
        this.set(key, undefined); // if already on add list, remove entry
      } else {
        this.set(key, ['remove', user.type])
      }
      this.set('attendees', this.get('attendees').filter((u) => {
        return user.id != u.id;
      }));
      this.get('members').pushObject(user);
    },
    filterMembers(e) {
      this.set('membersFilter', e.target.value);
    },
    filterAttendees(e){
      this.set('attendeesFilter', e.target.value);
    },
    submit() {
      this.userSubmit(this.get('changes'));
    }
  }
});
