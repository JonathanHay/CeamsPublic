import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    description: DS.attr(),
    recommendations: DS.attr(),
    decision: DS.attr(),
    
    meeting: DS.belongsTo('meeting'),
});
