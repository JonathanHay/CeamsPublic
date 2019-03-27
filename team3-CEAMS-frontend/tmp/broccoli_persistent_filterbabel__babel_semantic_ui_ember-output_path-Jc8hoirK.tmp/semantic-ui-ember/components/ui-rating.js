define('semantic-ui-ember/components/ui-rating', ['exports', 'semantic-ui-ember/mixins/base', 'semantic-ui-ember/templates/components/ui-rating'], function (exports, _base, _uiRating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    layout: _uiRating.default,
    module: 'rating',
    classNames: ['ui', 'rating'],
    ignorableAttrs: ['rating'],

    willInitSemantic(settings) {
      this._super(...arguments);
      if (settings.initialRating == null && this.get('rating')) {
        settings.initialRating = this.get('rating');
      }
    }
  });
});