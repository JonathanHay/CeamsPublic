import DS from 'ember-data';

export default DS.Model.extend({
    //userprofile attributes
    _id: DS.attr(),
    rawData: DS.attr(),
    username: DS.attr(),
    score: DS.attr(),
    error: DS.attr()
});
