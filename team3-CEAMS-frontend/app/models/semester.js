import DS from 'ember-data';

export default DS.Model.extend({
  courseContact: DS.attr('boolean'),
  term: DS.belongsTo('academicTerm'),
  year: DS.belongsTo('academicYear'),
  course: DS.belongsTo('course'),
  instructor: DS.belongsTo('instructor')
});
