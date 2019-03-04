import DS from 'ember-data';

export default DS.Model.extend({
  //userprofile attributes
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),

  //instructor attributes
  number: DS.attr(),
  CCMemberStatus: DS.attr(),
  hireDate: DS.attr(),
  estimatedRetirementDate: DS.attr(),
  keyPerformanceIndicator: DS.attr(),
  
  //relationships
  userGivenRoles: DS.hasmany('user-given-role'),
  committeeMembership: DS.hasmany('committee-membership'),
  userEvaluationMethod: DS.belongsto('user-evaluation-method'),
  licenceStatuses: DS.hasmany('licence-status'),
  academicRank: DS.belongstp('academic-rank'),
  academicDegrees: DS.hasmany('academic-degree'),
  semester: DS.hasmany('semester'),
  program: DS.hasmany('program'),
  userAccount: DS.belongsto('user-account')
});
