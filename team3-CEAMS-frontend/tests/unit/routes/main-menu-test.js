import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | MainMenu', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:main-menu');
    assert.ok(route);
  });
});
