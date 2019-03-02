import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(String),
    level: DS.attr(String),
    dateCreated: DS.attr(Date),

    committeeMembership: DS.hasmany('committee-membership'),
});
