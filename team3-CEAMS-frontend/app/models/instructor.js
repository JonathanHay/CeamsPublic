import DS from 'ember-data';

export default DS.Model.extend({
  //userprofile attributes
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  memberships: DS.hasMany('committee-membership'),

  //instructor attributes
  number: DS.attr(),
  CCMemberStatus: DS.attr(),
  hireDate: DS.attr(),
  estimatedRetirementDate: DS.attr(),
  keyPerformanceIndicator: DS.attr(),
  
  //relationships
  // userGivenRoles: DS.hasMany('user-given-role'),
  // committeeMembership: DS.hasMany('committee-membership'),
  evaluationMethod: DS.belongsTo('user-evaluation-method'),
  // licenceStatuses: DS.hasMany('licence-status'),
  // academicRank: DS.belongsTo('academic-rank'),
  // academicDegrees: DS.hasMany('academic-degree'),
  // semester: DS.hasMany('semester'),
  // program: DS.hasMany('program'),
  // userAccount: DS.belongsTo('user-account')
});
