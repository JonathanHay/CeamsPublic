import DS from 'ember-data';

export default DS.Model.extend({
    //userprofile attributes
    rawData: DS.attr(),
    userName: DS.attr(),
    score: DS.attr(),
    error: DS.attr()
});
