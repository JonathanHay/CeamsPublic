import DS from 'ember-data';

export default DS.Model.extend({
    number: DS.attr(String),
    CCMemberStatus: DS.attr(Boolean),
    hireDate: DS.attr(Date),
    estimatedRetirementDate: DS.attr(Date),
    keyPerformanceIndicator: DS.attr(),
    firstName: DS.attr(String),
    lastName: DS.attr(String), 
    email: DS.attr(String), 
    building: DS.attr(String),
    officeNumber: DS.attr(String), 
   
    //userprofile attr
    firstName: DS.attr(String),
    lastName: DS.attr(String),
    email: DS.attr(String),
    building: DS.attr(String),
    officeNumber: DS.attr(String),
});
