import DS from 'ember-data';

export default DS.Model.extend({
    startDateTime: DS.attr(),
    endDateTime: DS.attr(),
    location: DS.attr(),
    description: DS.attr(),
    minutes: DS.attr(),
<<<<<<< HEAD

=======
>>>>>>> wfincher
    attendees: DS.hasMany('committee-membership'),
    outcomes: DS.hasMany('meeting-outcomes')
});
