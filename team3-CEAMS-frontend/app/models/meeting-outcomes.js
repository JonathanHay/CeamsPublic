import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(String),
    description: DS.attr(String),
    recommendations: DS.attr(String),
    decision: DS.attr(String),
    
    meeting: DS.belongsTo('meeting'),
});
