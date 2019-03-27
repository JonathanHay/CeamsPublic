import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ceams/committees/detail', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ceams/committees/detail');
    assert.ok(route);
  });
});
