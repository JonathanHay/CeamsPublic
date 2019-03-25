import DS from 'ember-data';

export default DS.Model.extend({
  participationStartDate: DS.attr('data'),
  participationEndDate: DS.attr('data'),
  role: DS.attr(),
  meetings: DS.hasMany('meeting'),
  committee: DS.belongsTo('committee'),
  instructorMember: DS.belongsTo('instructor'),
  staffMember: DS.belongsTo('Staff'),
  teachingAssistantMember: DS.belongsTo('teachingAssistant')
});
