import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(),
    participationEndDate: DS.attr(),
    role: DS.attr(),
    committee: DS.attr(),
    instructorMember: DS.belongsTo('instructor'),
    staffMember: DS.belongsTo('staff'),
    teachingAssistantMember: DS.belongsTo('teachingAssistant'),
    meetings: DS.hasMany('meeting')
});