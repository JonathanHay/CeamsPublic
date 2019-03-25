define('semantic-ui-ember/components/ui-progress', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-progress'], function (exports, _base, _uiProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiProgress.default,
    module: 'progress',
    classNames: ['ui', 'progress'],
    ignorableAttrs: ['progress']
  });
});