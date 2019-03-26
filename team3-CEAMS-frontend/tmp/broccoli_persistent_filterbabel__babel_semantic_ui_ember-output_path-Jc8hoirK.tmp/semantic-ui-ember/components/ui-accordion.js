define('semantic-ui-ember/components/ui-accordion', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-accordion'], function (exports, _base, _uiAccordion) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiAccordion.default,
    module: 'accordion',
    classNames: ['ui', 'accordion']
  });
});