define('semantic-ui-ember/components/ui-embed', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-embed'], function (exports, _base, _uiEmbed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiEmbed.default,
    module: 'embed',
    classNames: ['ui', 'embed'],
    attributeBindings: ['data-icon', 'data-id', 'data-placeholder', 'data-source', 'data-url'],
    ignorableAttrs: ['data-icon', 'data-id', 'data-placeholder', 'data-source', 'data-url']
  });
});