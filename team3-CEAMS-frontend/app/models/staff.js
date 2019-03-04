import DS from 'ember-data';

export default DS.Model.extend({
  //userprofile attributes
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),

  roleName: DS.attr(),
  keyPerformanceIndicator: DS.attr(),
  userEvaluationMethod: DS.belongsTo('user-evaluation-method'),
  userGivenRoles: DS.hasMany('user-given-role'),
  userAccount: DS.belongsTo('user-account'),
  committeeMembership: DS.hasMany('committee-membership')
});
