define('semantic-ui-ember/components/ui-dimmer', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-dimmer'], function (exports, _base, _uiDimmer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiDimmer.default,
    module: 'dimmer'
  });
});