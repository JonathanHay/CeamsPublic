import DS from 'ember-data';

export default DS.Model.extend({
    //userprofile attributes
    rawData: DS.attr(),
    username: DS.attr(),
    score: DS.attr(),
});
