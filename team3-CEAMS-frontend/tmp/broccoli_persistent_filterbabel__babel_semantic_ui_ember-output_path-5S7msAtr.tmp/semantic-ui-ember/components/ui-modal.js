define('semantic-ui-ember/components/ui-modal', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-modal'], function (exports, _base, _uiModal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiModal.default,
    module: 'modal',
    classNames: ['ui', 'modal'],

    willInitSemantic(settings) {
      this._super(...arguments);
      if (settings.detachable == null) {
        settings.detachable = false;
      }
      if (settings.observeChanges == null) {
        settings.observeChanges = true;
      }
    }
  });
});