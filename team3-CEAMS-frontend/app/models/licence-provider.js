import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  dateIssued: DS.attr('date'),
  licenceStatus: DS.belongsTo('licenceStatus'),
  instructor: DS.belongsTo('instructor')
});
