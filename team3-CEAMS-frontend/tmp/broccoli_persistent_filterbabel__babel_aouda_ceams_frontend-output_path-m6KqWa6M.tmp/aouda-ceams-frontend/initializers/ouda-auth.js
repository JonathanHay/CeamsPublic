define("aouda-ceams-frontend/initializers/ouda-auth", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize(application) {
    application.inject('route', 'oudaAuth', 'service:ouda-auth');
    application.inject('controller', 'oudaAuth', 'service:ouda-auth');
    application.inject('component', 'oudaAuth', 'service:ouda-auth');
  }

  var _default = {
    name: 'ouda-auth',
    initialize
  };
  _exports.default = _default;
});