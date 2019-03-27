define("ember-data/relationships", ["exports", "ember-data/-private"], function (_exports, _private) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "belongsTo", {
    enumerable: true,
    get: function () {
      return _private.belongsTo;
    }
  });
  Object.defineProperty(_exports, "hasMany", {
    enumerable: true,
    get: function () {
      return _private.hasMany;
    }
  });
});