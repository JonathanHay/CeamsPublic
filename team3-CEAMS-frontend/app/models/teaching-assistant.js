import DS from 'ember-data';

export default DS.Model.extend({
  contactInfo: DS.attr(String),

  // UserProfile attributes
  firstName: DS.attr(String),
  lastName: DS.attr(String),
  email: DS.attr(String),
  building: DS.attr(String),
  officeNumber: DS.attr(String)
});
