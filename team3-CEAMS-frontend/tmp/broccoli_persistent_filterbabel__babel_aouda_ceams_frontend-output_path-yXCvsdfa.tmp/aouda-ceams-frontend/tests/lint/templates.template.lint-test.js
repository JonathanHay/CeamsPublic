define("aouda-ceams-frontend/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('aouda-ceams-frontend/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/application.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/components/datatable-example.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'aouda-ceams-frontend/templates/components/datatable-example.hbs should pass TemplateLint.\n\naouda-ceams-frontend/templates/components/datatable-example.hbs\n  7:4  error  Incorrect indentation for `<tr>` beginning at L7:C4. Expected `<tr>` to be at an indentation of 6 but was found at 4.  block-indentation\n  15:4  error  Incorrect indentation for `{{#each}}` beginning at L15:C4. Expected `{{#each}}` to be at an indentation of 6 but was found at 4.  block-indentation\n  25:4  error  Incorrect indentation for `<tr>` beginning at L25:C4. Expected `<tr>` to be at an indentation of 6 but was found at 4.  block-indentation\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/components/home-page.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/components/home-page.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/components/log-in.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/components/log-in.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/components/main-menu.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'aouda-ceams-frontend/templates/components/main-menu.hbs should pass TemplateLint.\n\naouda-ceams-frontend/templates/components/main-menu.hbs\n  5:0  error  Incorrect indentation for `<div>` beginning at L5:C0. Expected `<div>` to be at an indentation of 2 but was found at 0.  block-indentation\n  39:0  error  Incorrect indentation for `<div>` beginning at L39:C0. Expected `<div>` to be at an indentation of 2 but was found at 0.  block-indentation\n  297:0  error  Incorrect indentation for `<div>` beginning at L297:C0. Expected `<div>` to be at an indentation of 2 but was found at 0.  block-indentation\n  3:2  error  Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.  no-outlet-outside-routes\n  13:35  error  you must use double quotes in templates  quotes\n  14:35  error  you must use double quotes in templates  quotes\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/datatable-example.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/datatable-example.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/home-page.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/home-page.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/login.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/login.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('aouda-ceams-frontend/templates/main-menu.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'aouda-ceams-frontend/templates/main-menu.hbs should pass TemplateLint.\n\n');
  });
});