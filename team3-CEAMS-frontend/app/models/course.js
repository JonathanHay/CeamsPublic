import DS from 'ember-data';

export default DS.Model.extend({

  number: DS.attr(),
  title: DS.attr(),
  calendarWebLink: DS.attr(),
  notes: DS.attr(),
  kFactor: DS.attr('boolean'),
  engineeringScienceAUPercent: DS.attr('number'),
  engineeringDesignAUPercent: DS.attr('number'),
  mathAUPercent: DS.attr('number'),
  naturalScienceAUPercent: DS.attr('number'),
  complementaryStudiesAUPercent: DS.attr('number'),
  academicCredit: DS.attr('number'),
  labTutorialHoursPerWeek: DS.attr('number'),
  numberOfLectureSections: DS.attr('number'),
  numberOfLabTutorialSections: DS.attr('number'),
  numberOfLabs: DS.attr('number'),
  laboratorySafetyTaught: DS.attr('boolean'),
  laboratorySafetyExamined: DS.attr('boolean'),

  terms: DS.hasMany('semester'),
  indicators: DS.hasMany ('indicator'),


  preRequisites: DS.hasMany('course', { inverse: 'preRequisitesParent' }),
  preRequisitesParent: DS.belongsTo('course', { inverse: 'preRequisites' }),
  coRequisites: DS.hasMany('course', { inverse: 'coRequisitesParent' }),
  coRequisitesParent: DS.belongsTo('course', { inverse: 'coRequisites' }),


  courseType: DS.belongsTo ('courseType'),
  mathType: DS.belongsTo('mathType'),
  NSType: DS.belongsTo ('naturalScienceType'),
  CSType: DS.belongsTo ('complementaryStudiesType'),
  labType: DS.belongsTo('labType'),
  requiredTextbooks: DS.hasMany('textBook'),
  learningOutcomes: DS.hasMany ('courseLearningOutcome'),
  courseContents: DS.hasMany ('topic')


});
