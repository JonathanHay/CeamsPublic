define("aouda-ceams-frontend/routes/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    beforeModel() {
      let authentication = this.get('oudaAuth');
      authentication.set('isLoginRequested', false);
      let self = this;
      authentication.fetch().then(function () {
        self.transitionTo('home-page');
      }, function () {
        self.transitionTo('home-page');
      });
    }

  });

  _exports.default = _default;
});