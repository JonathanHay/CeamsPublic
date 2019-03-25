import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  building: DS.attr(),
  officeNumber: DS.attr(),
  contractInfo: DS.attr(),
  gender: DS.belongsTo('gender'),
  userShadow: DS.belongsTo('userAccount', { inverse: 'teachingAssistant' }),
  memberships: DS.hasMany('committeeMembership')
});
