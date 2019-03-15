import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(),
    participationEndDate: DS.attr(),
    role: DS.attr(),
    committee: DS.attr(),
    // instructorMember: DS.attr(),
    // staffMember: DS.attr(),
    // teachingAssistantMember: DS.attr(),
    // meetings: DS.attr(),
    instructorMember: DS.belongsTo('instructor'),
    staffMember: DS.belongsTo('staff'),
    teachingAssistantMember: DS.belongsTo('teaching-assistant'),
    meetings: DS.hasMany('meeting')
});
