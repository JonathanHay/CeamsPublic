import DS from 'ember-data';

export default DS.Model.extend({
    firstName: DS.attr(String),
    lastName: DS.attr(String),
    email: DS.attr(String),
    building: DS.attr(String),
    officeNumber: DS.attr(String),
    roleName: DS.attr(String),
    keyPerformanceIndicator: DS.attr(String)
});
