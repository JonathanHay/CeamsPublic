import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(Date),
    participationEndDate: DS.attr(Date),
    role: DS.attr(String),

    committee: DS.belongsTo('committee'),
});
