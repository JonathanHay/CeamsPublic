import DS from 'ember-data';

export default DS.Model.extend({
  permission: DS.attr('boolean'),
  role: DS.belongsTo('role'),
  feature: DS.belongsTo('capability')

});
