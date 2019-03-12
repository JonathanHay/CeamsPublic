import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(),
    participationEndDate: DS.attr(),
    role: DS.attr(),
<<<<<<< HEAD
    committee: DS.attr(),
    instructorMember: DS.attr(),
    staffMember: DS.attr(),
    teachingAssistantMember: DS.attr()
=======
    committee: DS.belongsTo('committee'),
    instructorMember: DS.belongsTo('instructor'),
    staffMember: DS.belongsTo('staff'),
    teachingAssistantMember: DS.belongsTo('teaching-assistant')
>>>>>>> jhay22
});
