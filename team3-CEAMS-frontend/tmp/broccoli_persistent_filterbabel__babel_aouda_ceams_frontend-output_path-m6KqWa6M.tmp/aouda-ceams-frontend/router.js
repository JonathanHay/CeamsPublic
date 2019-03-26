define("aouda-ceams-frontend/router", ["exports", "aouda-ceams-frontend/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {
    this.route('main-menu');
    this.route('home-page', {
      path: '/'
    });
    this.route('login');
    this.route('datatable-example');
  });
  var _default = Router;
  _exports.default = _default;
});