import { typeForRelationshipMeta, relationshipFromMeta } from '../relationship-meta';
export var relationshipsDescriptor = Ember.computed(function () {
  var map = new Map();
  var relationshipsByName = Ember.get(this, 'relationshipsByName'); // Loop through each computed property on the class

  relationshipsByName.forEach(desc => {
    var {
      type
    } = desc;

    if (!map.has(type)) {
      map.set(type, []);
    }

    map.get(type).push(desc);
  });
  return map;
}).readOnly();
export var relatedTypesDescriptor = Ember.computed(function () {
  var parentModelName = this.modelName;
  var types = Ember.A(); // Loop through each computed property on the class,
  // and create an array of the unique types involved
  // in relationships

  this.eachComputedProperty((name, meta) => {
    if (meta.isRelationship) {
      meta.key = name;
      var modelName = typeForRelationshipMeta(meta);
      (true && !(modelName) && Ember.assert(`You specified a hasMany (${meta.type}) on ${parentModelName} but ${meta.type} was not found.`, modelName));

      if (!types.includes(modelName)) {
        (true && !(!!modelName) && Ember.assert(`Trying to sideload ${name} on ${this.toString()} but the type doesn't exist.`, !!modelName));
        types.push(modelName);
      }
    }
  });
  return types;
}).readOnly();
export var relationshipsObjectDescriptor = Ember.computed(function () {
  var relationships = Object.create(null);
  var modelName = this.modelName;
  this.eachComputedProperty((name, meta) => {
    if (meta.isRelationship) {
      meta.key = name;
      meta.name = name;
      meta.parentModelName = modelName;
      relationships[name] = relationshipFromMeta(meta);
    }
  });
  return relationships;
});
export var relationshipsByNameDescriptor = Ember.computed(function () {
  var map = new Map();
  var rels = Ember.get(this, 'relationshipsObject');
  var relationships = Object.keys(rels);

  for (var i = 0; i < relationships.length; i++) {
    var key = relationships[i];
    var value = rels[key];
    map.set(value.key, value);
  }

  return map;
}).readOnly();