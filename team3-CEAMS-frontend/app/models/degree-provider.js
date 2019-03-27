import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  datedIssued: DS.attr('date'),
  degree: DS.belongsTo('academicDegree'),
  instructor: DS.belongsTo('instructor')
});
