define('semantic-ui-ember/components/ui-shape', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-shape'], function (exports, _base, _uiShape) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiShape.default,
    module: 'shape',
    classNames: ['ui', 'shape']
  });
});