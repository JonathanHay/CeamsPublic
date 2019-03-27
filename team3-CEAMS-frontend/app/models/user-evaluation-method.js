import DS from 'ember-data';

export default DS.Model.extend({
    formulaExpression: DS.attr(),
    formulaDescription: DS.attr(),
    formulaType: DS.attr(),

    instructors: DS.hasMany('instructor'),
    staff: DS.hasMany('staff')
});
