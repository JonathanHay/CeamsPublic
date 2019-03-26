import DS from 'ember-data';

export default DS.Model.extend({
  dateAssigned: DS.attr('date'),
  role: DS.belongsTo('role'),
  user: DS.belongsTo('userAccount')
});
