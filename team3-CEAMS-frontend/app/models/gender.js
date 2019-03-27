import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr(),
  instructorMembers: DS.hasMany('instructor'),
  staffMembers: DS.hasMany('staff'),
  teachingAssistantMembers: DS.hasMany('teachingAssistant')
});
