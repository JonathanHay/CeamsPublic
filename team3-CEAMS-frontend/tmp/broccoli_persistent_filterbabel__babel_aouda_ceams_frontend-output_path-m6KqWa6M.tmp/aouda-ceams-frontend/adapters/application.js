define("aouda-ceams-frontend/adapters/application", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.RESTAdapter.extend({
    host: 'http://localhost:3000' // host: 'https://localhost:8443'

  });

  _exports.default = _default;
});