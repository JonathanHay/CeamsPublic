import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  permissions: DS.hasMany('permission'),
  userRoles: DS.hasMany('userGivenRole')
});
