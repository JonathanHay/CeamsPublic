import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | indicators/assign-evaluation-methods', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{indicators/assign-evaluation-methods}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#indicators/assign-evaluation-methods}}
        template block text
      {{/indicators/assign-evaluation-methods}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
