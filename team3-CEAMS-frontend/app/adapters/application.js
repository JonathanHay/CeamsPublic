import DS from 'ember-data';
import Inflector from 'ember-inflector';
<<<<<<< HEAD

=======
>>>>>>> jhay22
export default DS.RESTAdapter.extend({
  host: 'http://127.0.0.1:3000',
  pathForType(type) {
    return Inflector.inflector.pluralize(Ember.String.dasherize(type));
  }
});
