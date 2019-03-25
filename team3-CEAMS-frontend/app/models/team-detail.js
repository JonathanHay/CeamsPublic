import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(),
    participationEndDate: DS.attr(),
    committeeName: DS.attr(String),
    committeeLevel: DS.attr(String),
});