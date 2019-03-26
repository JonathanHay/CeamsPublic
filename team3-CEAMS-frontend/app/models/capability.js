import DS from 'ember-data';

export default DS.Model.extend({
// name of the system functionality to be assign to a user
  code: DS.attr(),
  systemFeature: DS.attr()

});
