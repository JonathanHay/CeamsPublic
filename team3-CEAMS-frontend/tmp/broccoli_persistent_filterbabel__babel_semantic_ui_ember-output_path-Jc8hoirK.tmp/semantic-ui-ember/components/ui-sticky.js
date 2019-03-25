define('semantic-ui-ember/components/ui-sticky', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-sticky'], function (exports, _base, _uiSticky) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiSticky.default,
    module: 'sticky',
    classNames: ['ui', 'sticky']
  });
});