import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  number: DS.attr(),
  ccMemberStatus: DS.attr('boolean'),
  hireDate: DS.attr('date'),
  estimatedRetirementDate: DS.attr('date'),
  keyPerformanceIndicator: DS.attr('number'),

  gender: DS.belongsTo('gender'),
  evaluationMethod: DS.belongsTo('userEvaluationMethod'),
  rank: DS.belongsTo('academicRank'),
  userShadow: DS.belongsTo('userAccount', { inverse: 'instructor' }),

  programs: DS.hasMany('program'),
  licenceProviders: DS.hasMany('licenceProvider'),
  degreeProviders: DS.hasMany('degreeProvider'),
  semesters: DS.hasMany('semester'),
  memberships: DS.hasMany('committeeMembership')
});
