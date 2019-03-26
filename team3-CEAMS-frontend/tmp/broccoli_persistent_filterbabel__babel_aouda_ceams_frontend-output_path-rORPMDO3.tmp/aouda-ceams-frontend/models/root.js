define("aouda-ceams-frontend/models/root", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    password: _emberData.default.attr(),
    nonce: _emberData.default.attr(),
    response: _emberData.default.attr(),
    wrongPassword: _emberData.default.attr('boolean'),
    sessionIsActive: _emberData.default.attr('boolean')
  });

  _exports.default = _default;
});