import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr(),
  level: DS.attr(),
  dateCreated: DS.attr(),
  members: DS.hasMany('committee-membership')
});
