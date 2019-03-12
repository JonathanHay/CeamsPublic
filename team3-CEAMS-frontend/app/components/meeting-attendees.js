import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import {inject as service} from '@ember/service';



export default Component.extend({

    init() {
        this._super(...arguments);
        this.set('changes', {});
        this.set('allUsersFilter', '');
        this.set('membersFilter', '');
      },

      allUsers: computed('members', 'attendees', 'allUsersFilter', function() {
        return this.members.filter((u) => {
          return (u.firstName + " " + u.lastName).startsWith(this.get('allUsersFilter'));
        });
      }),
      
      members: computed('attendees', 'members', 'membersFilter', function() {
        return this.attendees.filter((u) => {
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
          this.set('members', this.get('members').filter((u) => {
            return user._id != u._id;
          }));
          this.get('attendees').pushObject(user);
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
          this.set('attendees', this.get('attendees').filter((u) => {
            return user._id != u._id;
          }));
          this.get('members').pushObject(user);
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
