import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  number: DS.attr(),
  CCMemberStatus: DS.attr(),
  hireDate: DS.attr(),
  estimatedRetirementDate: DS.attr(),
  keyPerformanceIndicator: DS.attr(),
  userGivenRoles: DS.hasmany('user-given-role'),
  membersAttendingMeeting: DS.hasmany('member-attending-meeting'),
  userEvaluationMethod: DS.belongsto('user-evaluation-method'),
  licenceStatuses: DS.hasmany('licence-status'),
  academicRank: DS.belongstp('academic-rank'),
  academicDegrees: DS.hasmany('academic-degree'),
  semester: DS.hasmany('semester'),
  program: DS.hasmany('program'),
  userAccount: DS.belongsto('user-account')
});
