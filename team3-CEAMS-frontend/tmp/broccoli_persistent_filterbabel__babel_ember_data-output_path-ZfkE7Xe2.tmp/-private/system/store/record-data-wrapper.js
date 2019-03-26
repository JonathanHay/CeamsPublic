export default class RecordDataWrapper {
  constructor(store) {
    this.store = store;
    this._willUpdateManyArrays = false;
    this._pendingManyArrayUpdates = null;
  }

  _scheduleManyArrayUpdate(modelName, id, clientId, key) {
    var pending = this._pendingManyArrayUpdates = this._pendingManyArrayUpdates || [];
    pending.push(modelName, id, clientId, key);

    if (this._willUpdateManyArrays === true) {
      return;
    }

    this._willUpdateManyArrays = true;
    var backburner = this.store._backburner;
    backburner.join(() => {
      backburner.schedule('syncRelationships', this, this._flushPendingManyArrayUpdates);
    });
  }

  _flushPendingManyArrayUpdates() {
    if (this._willUpdateManyArrays === false) {
      return;
    }

    var pending = this._pendingManyArrayUpdates;
    this._pendingManyArrayUpdates = [];
    this._willUpdateManyArrays = false;
    var store = this.store;

    for (var i = 0; i < pending.length; i += 4) {
      var modelName = pending[i];
      var id = pending[i + 1];
      var clientId = pending[i + 2];
      var key = pending[i + 3];

      var internalModel = store._getInternalModelForId(modelName, id, clientId);

      internalModel.notifyHasManyChange(key);
    }
  }

  attributesDefinitionFor(modelName) {
    return this.store._attributesDefinitionFor(modelName);
  }

  relationshipsDefinitionFor(modelName) {
    return this.store._relationshipsDefinitionFor(modelName);
  }

  inverseForRelationship(modelName, key) {
    var modelClass = this.store.modelFor(modelName);
    return this.relationshipsDefinitionFor(modelName)[key]._inverseKey(this.store, modelClass);
  } // TODO Igor David cleanup


  inverseIsAsyncForRelationship(modelName, key) {
    var modelClass = this.store.modelFor(modelName);
    return this.relationshipsDefinitionFor(modelName)[key]._inverseIsAsync(this.store, modelClass);
  }

  notifyPropertyChange(modelName, id, clientId, key) {
    var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

    internalModel.notifyPropertyChange(key);
  }

  notifyHasManyChange(modelName, id, clientId, key) {
    this._scheduleManyArrayUpdate(modelName, id, clientId, key);
  }

  notifyBelongsToChange(modelName, id, clientId, key) {
    var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

    internalModel.notifyBelongsToChange(key);
  }

  recordDataFor(modelName, id, clientId) {
    return this.store.recordDataFor(modelName, id, clientId);
  }

  setRecordId(modelName, id, clientId) {
    this.store.setRecordId(modelName, id, clientId);
  }

  isRecordInUse(modelName, id, clientId) {
    var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

    if (!internalModel) {
      return false;
    }

    return internalModel.isRecordInUse();
  }

  disconnectRecord(modelName, id, clientId) {
    var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

    if (internalModel) {
      internalModel.destroyFromRecordData();
    }
  }

}