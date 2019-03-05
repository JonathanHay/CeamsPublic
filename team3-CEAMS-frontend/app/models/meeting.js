import DS from 'ember-data';

export default DS.Model.extend({
    startDateTime: DS.attr(),
    endDateTime: DS.attr(),
    location: DS.attr(),
    description: DS.attr(),
    minutes: DS.attr(),

    committeeMembership: DS.hasMany('committee-membership'),
    meetingOutcomes: DS.hasMany('meeting-outcomes')
});
