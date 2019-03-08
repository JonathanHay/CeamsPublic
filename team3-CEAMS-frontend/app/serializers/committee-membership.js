import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    primaryKey: '_id',
    attrs: {
        teachingAssistant: { embedded: 'always' },
        staff: { embedded: 'always' },
        instructor: { embedded: 'always' }
    }
});