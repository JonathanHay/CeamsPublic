import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  ID: null,
  userRecord: null,
  selectedRole: null,
  userGivenRoleModel: null,
  userRoles: [],
  uniqueName: null,

  assignRolesModalName: computed(function () {
    let random = Math.random();
    this.set('uniqueName', Math.random().toString().split('.')[1] + this.get('userRecord').id);
    return 'ui ' + this.get('uniqueName') + ' modal';
  }),

  FEAT28_007IsPermitted: computed(function () {
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_007") >= 0);
    }
  }),


  roleCodeModel: computed(function () {
    return this.get('store').findAll('role');
  }),


  actions: {

    openModal: function () {
      let userID = this.get('userRecord').id;
      let myStore = this.get('store');
      let self = this;

      self.set('userGivenRoleModel', []);
      myStore.query('userGivenRole', {filter: {user: userID}}).then(function (roles) {
        roles.forEach(function (oneRole) {
          var roleID = oneRole.get('role').get('id');
          self.get('store').findRecord('role', roleID).then(function (role) {
            self.get('userGivenRoleModel').pushObject(role);

          });
        });

      });

      $('.ui.' + this.get('uniqueName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        autofocus: false,
        useFlex: false,

        onDeny: function () {
          return true;
        },
        onApprove: function () {
          return true;
        }
      })
        .modal('show');


    },


    selectRole(role) {
      $('.ui.floating.dropdown .text').val('Add User Role');

      var myStore = this.get('store');
      var roleCode = myStore.peekRecord('role', role);

      var roleNotAssigned = this.get('userGivenRoleModel').every(function (oneRole) {
        //   return (role !== oneRole.id);
        return (roleCode.get('id') !== oneRole.id);
      });

      if (roleNotAssigned) {
        this.get('userGivenRoleModel').pushObject(roleCode);
        myStore.createRecord('userGivenRole', {
          dateAssigned: new Date(),
          user: myStore.peekRecord('userAccount', this.get('userRecord').get('id')),
          role: roleCode
        }).save();
      }
    },

    deleteRole: function (id) {
      let myStore = this.get('store');
      let roles = [];
      let userID = this.get('userRecord').id;

      this.get('userGivenRoleModel').forEach(function (userrole) {
        if (userrole.id !== id) {
          roles.pushObject(userrole);
        }
      });
      this.set('userGivenRoleModel', roles);
      myStore.queryRecord('userGivenRole', {filter: {user: userID, role: id}}).then(function (userRole) {
        userRole.save().then(function (toDelete) {
          toDelete.destroyRecord();
        });
      });
    }
  }
});