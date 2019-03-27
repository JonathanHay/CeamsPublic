import { _bind, _guard, _objectIsAlive, guardDestroyedStore } from './common';
import { normalizeResponseHelper } from './serializer-response';
import { serializerForAdapter } from './serializers';

function payloadIsNotBlank(adapterPayload) {
  if (Array.isArray(adapterPayload)) {
    return true;
  } else {
    return Object.keys(adapterPayload || {}).length;
  }
}

export function _find(adapter, store, modelClass, id, internalModel, options) {
  var snapshot = internalModel.createSnapshot(options);
  var {
    modelName
  } = internalModel;
  var promise = Ember.RSVP.Promise.resolve().then(() => {
    return adapter.findRecord(store, modelClass, id, snapshot);
  });
  var label = `DS: Handle Adapter#findRecord of '${modelName}' with id: '${id}'`;
  promise = guardDestroyedStore(promise, store, label);
  return promise.then(adapterPayload => {
    (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findRecord' request for a '${modelName}' with id '${id}', but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
    var serializer = serializerForAdapter(store, adapter, modelName);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, id, 'findRecord');
    (true && !(!Array.isArray(payload.data)) && Ember.assert(`Ember Data expected the primary data returned from a 'findRecord' response to be an object but instead it found an array.`, !Array.isArray(payload.data)));
    (true && Ember.warn(`You requested a record of type '${modelName}' with id '${id}' but the adapter returned a payload with primary data having an id of '${payload.data.id}'. Use 'store.findRecord()' when the requested id is the same as the one returned by the adapter. In other cases use 'store.queryRecord()' instead https://emberjs.com/api/data/classes/DS.Store.html#method_queryRecord`, payload.data.id === id, {
      id: 'ds.store.findRecord.id-mismatch'
    }));
    return store._push(payload);
  }, error => {
    internalModel.notFound();

    if (internalModel.isEmpty()) {
      internalModel.unloadRecord();
    }

    throw error;
  }, `DS: Extract payload of '${modelName}'`);
}
export function _findMany(adapter, store, modelName, ids, internalModels, optionsMap) {
  var snapshots = Ember.A(internalModels.map(internalModel => internalModel.createSnapshot(optionsMap.get(internalModel))));
  var modelClass = store.modelFor(modelName); // `adapter.findMany` gets the modelClass still

  var promise = adapter.findMany(store, modelClass, ids, snapshots);
  var label = `DS: Handle Adapter#findMany of '${modelName}'`;

  if (promise === undefined) {
    throw new Error('adapter.findMany returned undefined, this was very likely a mistake');
  }

  promise = guardDestroyedStore(promise, store, label);
  return promise.then(adapterPayload => {
    (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findMany' request for '${modelName}' records with ids '[${ids}]', but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
    var serializer = serializerForAdapter(store, adapter, modelName);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findMany');
    return store._push(payload);
  }, null, `DS: Extract payload of ${modelName}`);
}

function iterateData(data, fn) {
  if (Array.isArray(data)) {
    return data.map(fn);
  } else {
    return fn(data);
  }
} // sync
// iterate over records in payload.data
// for each record
//   assert that record.relationships[inverse] is either undefined (so we can fix it)
//     or provide a data: {id, type} that matches the record that requested it
//   return the relationship data for the parent


function syncRelationshipDataFromLink(store, payload, parentInternalModel, relationship) {
  // ensure the right hand side (incoming payload) points to the parent record that
  // requested this relationship
  var relationshipData = iterateData(payload.data, (data, index) => {
    var {
      id,
      type
    } = data;
    ensureRelationshipIsSetToParent(data, parentInternalModel, store, relationship, index);
    return {
      id,
      type
    };
  }); // now, push the left hand side (the parent record) to ensure things are in sync, since
  // the payload will be pushed with store._push

  store.push({
    data: {
      id: parentInternalModel.id,
      type: parentInternalModel.modelName,
      relationships: {
        [relationship.key]: {
          data: relationshipData
        }
      }
    }
  });
}

function ensureRelationshipIsSetToParent(payload, parentInternalModel, store, parentRelationship, index) {
  var {
    id,
    type
  } = payload;

  if (!payload.relationships) {
    payload.relationships = {};
  }

  var {
    relationships
  } = payload;
  var inverse = getInverse(store, parentInternalModel, parentRelationship, type);

  if (inverse) {
    var {
      inverseKey,
      kind
    } = inverse;
    var relationshipData = relationships[inverseKey] && relationships[inverseKey].data;

    if (true
    /* DEBUG */
    && typeof relationshipData !== 'undefined' && !relationshipDataPointsToParent(relationshipData, parentInternalModel)) {
      var quotedType = Ember.inspect(type);
      var quotedInverse = Ember.inspect(inverseKey);
      var expected = Ember.inspect({
        id: parentInternalModel.id,
        type: parentInternalModel.modelName
      });
      var expectedModel = Ember.inspect(parentInternalModel);
      var got = Ember.inspect(relationshipData);
      var prefix = typeof index === 'number' ? `data[${index}]` : `data`;
      var path = `${prefix}.relationships.${inverse}.data`;
      var other = relationshipData ? `<${relationshipData.type}:${relationshipData.id}>` : null;
      var relationshipFetched = `${Ember.inspect(parentInternalModel)}.${parentRelationship.kind}("${parentRelationship.name}")`;
      var includedRecord = `<${type}:${id}>`;
      var message = [`Encountered mismatched relationship: Ember Data expected ${path} in the payload from ${relationshipFetched} to include ${expected} but got ${got} instead.\n`, `The ${includedRecord} record loaded at ${prefix} in the payload specified ${other} as its ${quotedInverse}, but should have specified ${expectedModel} (the record the relationship is being loaded from) as its ${quotedInverse} instead.`, `This could mean that the response for ${relationshipFetched} may have accidentally returned ${quotedType} records that aren't related to ${expectedModel} and could be related to a different ${parentInternalModel.modelName} record instead.`, `Ember Data has corrected the ${includedRecord} record's ${quotedInverse} relationship to ${expectedModel} so that ${relationshipFetched} will include ${includedRecord}.`, `Please update the response from the server or change your serializer to either ensure that the response for only includes ${quotedType} records that specify ${expectedModel} as their ${quotedInverse}, or omit the ${quotedInverse} relationship from the response.`].join('\n'); // this should eventually throw instead of deprecating.

      (true && !(false) && Ember.deprecate(message + '\n', false, {
        id: 'mismatched-inverse-relationship-data-from-payload',
        until: '3.8'
      }));
    }

    relationships[inverseKey] = relationships[inverseKey] || {};
    relationships[inverseKey].data = fixRelationshipData(relationshipData, kind, parentInternalModel);
  }
}

function getInverse(store, parentInternalModel, parentRelationship, type) {
  if (store.recordDataWrapper) {
    return recordDataFindInverseRelationshipInfo(store, parentInternalModel, parentRelationship, type);
  } else {
    return legacyFindInverseRelationshipInfo(store, parentInternalModel, parentRelationship);
  }
}

function recordDataFindInverseRelationshipInfo({
  recordDataWrapper
}, parentInternalModel, parentRelationship, type) {
  var {
    name: lhs_relationshipName
  } = parentRelationship;
  var {
    modelName
  } = parentInternalModel;
  var inverseKey = recordDataWrapper.inverseForRelationship(modelName, lhs_relationshipName);

  if (inverseKey) {
    var {
      meta: {
        kind
      }
    } = recordDataWrapper.relationshipsDefinitionFor(type)[inverseKey];
    return {
      inverseKey,
      kind
    };
  }
}

function legacyFindInverseRelationshipInfo(store, parentInternalModel, parentRelationship) {
  var {
    name: lhs_relationshipName
  } = parentRelationship;
  var {
    modelName
  } = parentInternalModel;

  var relationshipInfo = store._relationshipsPayloads.getRelationshipInfo(modelName, lhs_relationshipName);

  var {
    hasInverse,
    rhs_relationshipName: inverseKey,
    rhs_relationshipMeta
  } = relationshipInfo;

  if (hasInverse) {
    var {
      meta: {
        kind
      }
    } = rhs_relationshipMeta;
    return {
      inverseKey,
      kind
    };
  }
}

function relationshipDataPointsToParent(relationshipData, internalModel) {
  if (relationshipData === null) {
    return false;
  }

  if (Array.isArray(relationshipData)) {
    if (relationshipData.length === 0) {
      return false;
    }

    for (var i = 0; i < relationshipData.length; i++) {
      var entry = relationshipData[i];

      if (validateRelationshipEntry(entry, internalModel)) {
        return true;
      }
    }
  } else {
    return validateRelationshipEntry(relationshipData, internalModel);
  }

  return false;
}

function fixRelationshipData(relationshipData, relationshipKind, {
  id,
  modelName
}) {
  var parentRelationshipData = {
    id,
    type: modelName
  };
  var payload;

  if (relationshipKind === 'hasMany') {
    payload = relationshipData || [];
    payload.push(parentRelationshipData);
  } else {
    payload = relationshipData || {};
    Ember.merge(payload, parentRelationshipData);
  }

  return payload;
}

function validateRelationshipEntry({
  id
}, {
  id: parentModelID
}) {
  return id && id.toString() === parentModelID;
}

export function _findHasMany(adapter, store, internalModel, link, relationship, options) {
  var snapshot = internalModel.createSnapshot(options);
  var modelClass = store.modelFor(relationship.type);
  var promise = adapter.findHasMany(store, snapshot, link, relationship);
  var label = `DS: Handle Adapter#findHasMany of '${internalModel.modelName}' : '${relationship.type}'`;
  promise = guardDestroyedStore(promise, store, label);
  promise = _guard(promise, _bind(_objectIsAlive, internalModel));
  return promise.then(adapterPayload => {
    (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findHasMany' request for a ${internalModel.modelName}'s '${relationship.key}' relationship, using link '${link}' , but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
    var serializer = serializerForAdapter(store, adapter, relationship.type);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findHasMany');
    syncRelationshipDataFromLink(store, payload, internalModel, relationship);

    var internalModelArray = store._push(payload);

    internalModelArray.meta = payload.meta;
    return internalModelArray;
  }, null, `DS: Extract payload of '${internalModel.modelName}' : hasMany '${relationship.type}'`);
}
export function _findBelongsTo(adapter, store, internalModel, link, relationship, options) {
  var snapshot = internalModel.createSnapshot(options);
  var modelClass = store.modelFor(relationship.type);
  var promise = adapter.findBelongsTo(store, snapshot, link, relationship);
  var label = `DS: Handle Adapter#findBelongsTo of ${internalModel.modelName} : ${relationship.type}`;
  promise = guardDestroyedStore(promise, store, label);
  promise = _guard(promise, _bind(_objectIsAlive, internalModel));
  return promise.then(adapterPayload => {
    var serializer = serializerForAdapter(store, adapter, relationship.type);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findBelongsTo');

    if (!payload.data) {
      return null;
    }

    syncRelationshipDataFromLink(store, payload, internalModel, relationship);
    return store._push(payload);
  }, null, `DS: Extract payload of ${internalModel.modelName} : ${relationship.type}`);
}
export function _findAll(adapter, store, modelName, sinceToken, options) {
  var modelClass = store.modelFor(modelName); // adapter.findAll depends on the class

  var recordArray = store.peekAll(modelName);

  var snapshotArray = recordArray._createSnapshot(options);

  var promise = Ember.RSVP.Promise.resolve().then(() => adapter.findAll(store, modelClass, sinceToken, snapshotArray));
  var label = 'DS: Handle Adapter#findAll of ' + modelClass;
  promise = guardDestroyedStore(promise, store, label);
  return promise.then(adapterPayload => {
    (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findAll' request for '${modelName}' records, but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
    var serializer = serializerForAdapter(store, adapter, modelName);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findAll');

    store._push(payload);

    store._didUpdateAll(modelName);

    return recordArray;
  }, null, 'DS: Extract payload of findAll ${modelName}');
}
export function _query(adapter, store, modelName, query, recordArray, options) {
  var modelClass = store.modelFor(modelName); // adapter.query needs the class

  var promise;
  var createRecordArray = adapter.query.length > 3 || adapter.query.wrappedFunction && adapter.query.wrappedFunction.length > 3;

  if (createRecordArray) {
    recordArray = recordArray || store.recordArrayManager.createAdapterPopulatedRecordArray(modelName, query);
    promise = Ember.RSVP.Promise.resolve().then(() => adapter.query(store, modelClass, query, recordArray, options));
  } else {
    promise = Ember.RSVP.Promise.resolve().then(() => adapter.query(store, modelClass, query));
  }

  var label = `DS: Handle Adapter#query of ${modelName}`;
  promise = guardDestroyedStore(promise, store, label);
  return promise.then(adapterPayload => {
    var serializer = serializerForAdapter(store, adapter, modelName);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'query');

    var internalModels = store._push(payload);

    (true && !(Array.isArray(internalModels)) && Ember.assert('The response to store.query is expected to be an array but it was a single record. Please wrap your response in an array or use `store.queryRecord` to query for a single record.', Array.isArray(internalModels)));

    if (recordArray) {
      recordArray._setInternalModels(internalModels, payload);
    } else {
      recordArray = store.recordArrayManager.createAdapterPopulatedRecordArray(modelName, query, internalModels, payload);
    }

    return recordArray;
  }, null, `DS: Extract payload of query ${modelName}`);
}
export function _queryRecord(adapter, store, modelName, query, options) {
  var modelClass = store.modelFor(modelName); // adapter.queryRecord needs the class

  var promise = Ember.RSVP.Promise.resolve().then(() => adapter.queryRecord(store, modelClass, query, options));
  var label = `DS: Handle Adapter#queryRecord of ${modelName}`;
  promise = guardDestroyedStore(promise, store, label);
  return promise.then(adapterPayload => {
    var serializer = serializerForAdapter(store, adapter, modelName);
    var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'queryRecord');
    (true && !(!Array.isArray(payload.data)) && Ember.assert(`Expected the primary data returned by the serializer for a 'queryRecord' response to be a single object or null but instead it was an array.`, !Array.isArray(payload.data), {
      id: 'ds.store.queryRecord-array-response'
    }));
    return store._push(payload);
  }, null, `DS: Extract payload of queryRecord ${modelName}`);
}