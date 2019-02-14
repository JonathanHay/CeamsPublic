import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  contactInfo: DS.attr(),
  userGivenRoles: DS.hasmany('user-given-role'),
  userAccount: DS.belongsto('user-account'),
  membersAttendingMeeting: DS.hasmany('member-attending-meeting')
})
