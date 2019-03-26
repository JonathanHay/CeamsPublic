import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  roleName: DS.attr(),
  keyPerformanceIndicator: DS.attr('number'),

  gender: DS.belongsTo('gender'),
  evaluationMethod: DS.belongsTo('userEvaluationMethod'),
  userShadow: DS.belongsTo('userAccount', { inverse: 'staff' }),

  memberships: DS.hasMany('committeeMembership')
});
