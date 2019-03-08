import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  memberships: DS.attr(),

  contactInfo: DS.attr(),
  // userGivenRoles: DS.hasMany('user-given-role'),
  // userAccount: DS.belongsTo('user-account'),
  // committeeMembership: DS.hasMany('committee-membership')
});
