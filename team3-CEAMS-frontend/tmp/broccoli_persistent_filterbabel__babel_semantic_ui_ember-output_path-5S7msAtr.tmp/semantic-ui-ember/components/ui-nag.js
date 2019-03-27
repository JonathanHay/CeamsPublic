define('semantic-ui-ember/components/ui-nag', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-nag'], function (exports, _base, _uiNag) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiNag.default,
    module: 'nag',
    classNames: ['ui', 'nag']
  });
});