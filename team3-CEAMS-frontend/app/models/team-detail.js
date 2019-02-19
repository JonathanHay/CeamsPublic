import DS from 'ember-data';

export default DS.Model.extend({
    committeeName: DS.attr(String),
    committeeLevel: DS.attr(String),
    member: DS.attr(String),
});
