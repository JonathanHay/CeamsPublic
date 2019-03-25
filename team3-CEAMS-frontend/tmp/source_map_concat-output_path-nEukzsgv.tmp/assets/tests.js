'use strict';

define("aouda-ceams-frontend/tests/helpers/ember-cli-file-picker", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.uploadFileHelper = _exports.uploadFile = void 0;

  /* global Blob, jQuery */
  function createFile(content = ['test'], options = {}) {
    const {
      name,
      type,
      lastModifiedDate
    } = options;
    const file = new Blob(content, {
      type: type ? type : 'text/plain'
    });
    file.name = name ? name : 'test.txt';
    return file;
  }

  const uploadFileHelper = function (content, options) {
    const file = createFile(content, options);
    const event = jQuery.Event('change');
    event.target = {
      files: [file]
    };
    jQuery('.file-picker__input').trigger(event);
  };

  _exports.uploadFileHelper = uploadFileHelper;
  const uploadFile = Ember.Test.registerAsyncHelper('uploadFile', function (app, content, options) {
    uploadFileHelper(content, options);
    return wait();
  });
  _exports.uploadFile = uploadFile;
});
define("aouda-ceams-frontend/tests/integration/components/datatable-example-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | datatable-example', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "jmT3Kpuz",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"datatable-example\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), ''); // Template block usage:

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "e3dlVtcC",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"datatable-example\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define("aouda-ceams-frontend/tests/integration/components/home-page-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | home-page', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "y4s1tz8O",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"home-page\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), ''); // Template block usage:

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "tQOrpJj5",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"home-page\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define("aouda-ceams-frontend/tests/integration/components/log-in-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | log-in', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Kr+0nXUg",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"log-in\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), ''); // Template block usage:

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bGvnlUmA",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"log-in\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define("aouda-ceams-frontend/tests/integration/components/main-menu-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | main-menu', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "BnzDkI/b",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"main-menu\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), ''); // Template block usage:

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bTG14APA",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"main-menu\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define("aouda-ceams-frontend/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('components/datatable-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/datatable-example.js should pass ESLint\n\n');
  });
  QUnit.test('components/home-page.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/home-page.js should pass ESLint\n\n');
  });
  QUnit.test('components/log-in.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/log-in.js should pass ESLint\n\n23:13 - Unexpected console statement. (no-console)');
  });
  QUnit.test('components/main-menu.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/main-menu.js should pass ESLint\n\n');
  });
  QUnit.test('initializers/ouda-auth.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/ouda-auth.js should pass ESLint\n\n');
  });
  QUnit.test('models/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/login.js should pass ESLint\n\n');
  });
  QUnit.test('models/root.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/root.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });
  QUnit.test('routes/datatable-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/datatable-example.js should pass ESLint\n\n');
  });
  QUnit.test('routes/home-page.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/home-page.js should pass ESLint\n\n');
  });
  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });
  QUnit.test('routes/main-menu.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/main-menu.js should pass ESLint\n\n');
  });
  QUnit.test('services/ouda-auth.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/ouda-auth.js should pass ESLint\n\n');
  });
});
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
define("aouda-ceams-frontend/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('integration/components/datatable-example-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/datatable-example-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/home-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/home-page-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/log-in-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/log-in-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/main-menu-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/main-menu-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/adapters/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/initializers/ouda-auth-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/ouda-auth-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/models/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/login-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/models/root-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/root-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/datatable-example-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/datatable-example-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/home-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/home-page-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/login-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/main-menu-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/main-menu-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/services/ouda-auth-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/ouda-auth-test.js should pass ESLint\n\n');
  });
});
define("aouda-ceams-frontend/tests/test-helper", ["aouda-ceams-frontend/app", "aouda-ceams-frontend/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("aouda-ceams-frontend/tests/unit/adapters/application-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Adapter | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let adapter = this.owner.lookup('adapter:application');
      assert.ok(adapter);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/initializers/ouda-auth-test", ["aouda-ceams-frontend/initializers/ouda-auth", "qunit", "ember-qunit"], function (_oudaAuth, _qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Initializer | ouda-auth', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    hooks.beforeEach(function () {
      this.TestApplication = Ember.Application.extend();
      this.TestApplication.initializer({
        name: 'initializer under test',
        initialize: _oudaAuth.initialize
      });
      this.application = this.TestApplication.create({
        autoboot: false
      });
    });
    hooks.afterEach(function () {
      Ember.run(this.application, 'destroy');
    }); // Replace this with your real tests.

    (0, _qunit.test)('it works', async function (assert) {
      await this.application.boot();
      assert.ok(true);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/models/login-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Model | login', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = store.createRecord('login', {});
      assert.ok(model);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/models/root-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Model | root', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = store.createRecord('root', {});
      assert.ok(model);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/routes/application-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:application');
      assert.ok(route);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/routes/datatable-example-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | datatable-example', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:datatable-example');
      assert.ok(route);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/routes/home-page-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | home-page', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:home-page');
      assert.ok(route);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/routes/login-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | login', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:login');
      assert.ok(route);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/routes/main-menu-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | MainMenu', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:main-menu');
      assert.ok(route);
    });
  });
});
define("aouda-ceams-frontend/tests/unit/services/ouda-auth-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Service | ouda-auth', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:ouda-auth');
      assert.ok(service);
    });
  });
});
define('aouda-ceams-frontend/config/environment', [], function() {
  var prefix = 'aouda-ceams-frontend';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('aouda-ceams-frontend/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
