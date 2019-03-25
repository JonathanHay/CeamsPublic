import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  questionOne: DS.attr(),
  questionTwo:DS.attr(),
  questionThree: DS.attr(),
  answerOne: DS.attr(),
  answerTwo: DS.attr(),
  answerThree: DS.attr(),
  programStatement: DS.attr(),
  departments: DS.hasMany('department'),
  director: DS.belongsTo('instructor')
});
