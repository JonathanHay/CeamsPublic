import DS from 'ember-data';

export default DS.Model.extend({
  participationStartDate: DS.attr(),
  participationEndDate: DS.attr(),
  memberRole: DS.attr(),
  committeeName: DS.attr(),
  committeeLevel: DS.attr(),
  instructor: DS.belongsto('instructor'),
  staff: DS.belongsto('staff'),
  teachingAssistant: DS.belongsto('teaching-assistant')
});
