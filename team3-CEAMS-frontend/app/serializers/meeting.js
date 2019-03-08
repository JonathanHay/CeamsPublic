import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: '_id',
  attrs: {
      outcomes: { 'serialize':'records',
                  'deserialize':'records'},
      attendees: {'serialize':'records',
                  'deserialize':'records'}
    }
  });