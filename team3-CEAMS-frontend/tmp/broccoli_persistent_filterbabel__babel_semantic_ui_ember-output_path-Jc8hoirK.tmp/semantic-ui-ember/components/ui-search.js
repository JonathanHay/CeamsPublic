define('semantic-ui-ember/components/ui-search', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-search'], function (exports, _base, _uiSearch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiSearch.default,
    module: 'search',
    classNames: ['ui', 'search']
  });
});