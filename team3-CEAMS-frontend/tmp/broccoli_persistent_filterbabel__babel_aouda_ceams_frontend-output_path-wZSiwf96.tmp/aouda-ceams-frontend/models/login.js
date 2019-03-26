define("aouda-ceams-frontend/models/login", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    userName: _emberData.default.attr(),
    password: _emberData.default.attr(),
    nonce: _emberData.default.attr(),
    response: _emberData.default.attr(),
    token: _emberData.default.attr(),
    requestType: _emberData.default.attr(),
    wrongUserName: _emberData.default.attr('boolean'),
    wrongPassword: _emberData.default.attr('boolean'),
    passwordMustChanged: _emberData.default.attr('boolean'),
    passwordReset: _emberData.default.attr('boolean'),
    loginFailed: _emberData.default.attr('boolean'),
    accountIsDisabled: _emberData.default.attr('boolean'),
    sessionIsActive: _emberData.default.attr('boolean')
  });

  _exports.default = _default;
});