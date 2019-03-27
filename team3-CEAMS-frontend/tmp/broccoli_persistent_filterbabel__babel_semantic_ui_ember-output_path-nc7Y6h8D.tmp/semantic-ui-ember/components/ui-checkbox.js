define('semantic-ui-ember/components/ui-checkbox', ['exports', 'semantic-ui-ember/mixins/checkbox', 'semantic-ui-ember/templates/components/ui-checkbox'], function (exports, _checkbox, _uiCheckbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_checkbox.default, {
    layout: _uiCheckbox.default,
    type: 'checkbox',
    ignorableAttrs: ['checked', 'label', 'disabled'],

    // Internal wrapper for onchange, to pass through checked
    _onChange() {
      let checked = this.execute('is checked');
      return this.attrs.onChange(checked, this);
    }
  });
});