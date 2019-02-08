import DS from 'ember-data';

export default DS.Model.extend({
    participationStartDate: DS.attr(Date),
    participationEndDate: DS.attr(Date),
    memberRole: DS.attr(String),
    committeeName: DS.attr(String),
    committeeLevel: DS.attr(String),
});
