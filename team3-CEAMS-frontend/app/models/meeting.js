import DS from 'ember-data';

export default DS.Model.extend({
    startDateTime: DS.attr(),
    endDateTime: DS.attr(),
    location: DS.attr(String),
    description: DS.attr(String),
    minutes: DS.attr(String),

    committeeMembership: DS.hasmany('committee-membership'),
    meetingOutcomes: DS.hasMany('meeting-outcomes')
});
