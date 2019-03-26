define('semantic-ui-ember/components/ui-sidebar', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-sidebar'], function (exports, _base, _uiSidebar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiSidebar.default,
    module: 'sidebar',
    classNames: ['ui', 'sidebar']
  });
});