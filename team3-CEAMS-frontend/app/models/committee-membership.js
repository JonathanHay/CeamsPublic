import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(),
    participationEndDate: DS.attr(),
    role: DS.attr(),
    committee: DS.attr(),
    instructorMember: DS.attr(),
    staffMember: DS.attr(),
    teachingAssistantMember: DS.attr()
});
