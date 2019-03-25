import ManyRelationship from './has-many';
import BelongsToRelationship from './belongs-to';

function createRelationshipFor(relationshipMeta, store, recordData, key) {
  var inverseKey = recordData.storeWrapper.inverseForRelationship(recordData.modelName, key);
  var inverseIsAsync = recordData.storeWrapper.inverseIsAsyncForRelationship(recordData.modelName, key);

  if (relationshipMeta.kind === 'hasMany') {
    return new ManyRelationship(store, inverseKey, relationshipMeta, recordData, inverseIsAsync);
  } else {
    return new BelongsToRelationship(store, inverseKey, relationshipMeta, recordData, inverseIsAsync);
  }
}

export default class Relationships {
  constructor(recordData) {
    this.recordData = recordData;
    this.initializedRelationships = Object.create(null);
  }

  has(key) {
    return !!this.initializedRelationships[key];
  }

  forEach(cb) {
    var rels = this.initializedRelationships;
    Object.keys(rels).forEach(name => {
      cb(name, rels[name]);
    });
  }

  get(key) {
    var relationships = this.initializedRelationships;
    var relationship = relationships[key];

    if (!relationship) {
      var recordData = this.recordData;
      var rel = this.recordData.storeWrapper.relationshipsDefinitionFor(this.recordData.modelName)[key];

      if (rel) {
        relationship = relationships[key] = createRelationshipFor(rel, recordData.store, recordData, key);
      }
    }

    return relationship;
  }

}