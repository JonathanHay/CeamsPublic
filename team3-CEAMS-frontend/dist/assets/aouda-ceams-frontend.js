'use strict';



;define("aouda-ceams-frontend/adapters/application", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.RESTAdapter.extend({//host: 'http://127.0.0.1:3000'
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/app", ["exports", "aouda-ceams-frontend/resolver", "ember-load-initializers", "aouda-ceams-frontend/config/environment"], function (_exports, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/committees/manage-users", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/committees/team-detail", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/ga-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/home-page", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/log-in", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    routing: Ember.inject.service('router'),
    error: null,
    errorMessage: Ember.computed('error', function () {
      return this.get('error');
    }),
    actions: {
      login() {
        // we do not authenticate user until feature ?? is implemented
        this.get('routing').transitionTo('main-menu');
      }

    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/main-menu", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    didRender() {
      this._super(...arguments);

      Ember.$(document).ready(function () {
        // hide and open menu on small screen
        Ember.$('.ui.toggle.button').click(function () {
          Ember.$('.mobile.tablet.only.row .ui.vertical.menu').toggle("250", "linear");
        }); // toggle right sidebar

        Ember.$('.ui.right.sidebar').sidebar({
          context: Ember.$('.pusher.segment'),
          dimPage: false,
          closeable: false
        }).sidebar('setting', 'transition', 'push').sidebar('attach events', '.ui.blue.button'); // toggle left sidebar

        Ember.$('.ui.left.sidebar').sidebar({
          context: Ember.$('body')
        }).sidebar('setting', 'transition', 'scale down').sidebar('attach events', '.ui.green.button');
      });
    }

  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/meeting-component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/nav-bar", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/new-meeting", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    DS: Ember.inject.service('store'),
    actions: {
      closeModal: function () {
        $('.ui.newMeeting.modal').modal('hide');
      },
      openModal: function () {
        this.set('meetingTitle', null);
        this.set('meetingPlace', null);
        this.set('meetingObjective', null);
        this.set('meetingDescription', null);
        this.set('otherDetail', null);
        this.set('startDatetime', null);
        this.set('endDateTime', null);
        $('.ui.newMeeting.modal').modal({
          closable: false,
          onDeny: () => {
            return true;
          },
          onApprove: () => {
            var newMeetingMinute = this.get('DS').createRecord('meeting-minutes', {
              meetingTitle: this.get('meetingTitle'),
              meetingPlace: this.get('meetingPlace'),
              meetingObjective: this.get('meetingObjective'),
              meetingDescription: this.get('meetingDescription'),
              otherDetail: this.get('otherDetail')
            });
            newMeetingMinute.save().then(() => {
              return true;
            });
            var newMeeting = this.get('DS').createRecord('meetings', {
              startDateTime: this.get('startDateTime'),
              endDateTime: this.get('endDateTime')
            });
            newMeeting.save().then(() => {
              return true;
            });
          }
        }).modal('show');
      }
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/new-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/task-force-management", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/ui-accordion", ["exports", "semantic-ui-ember/components/ui-accordion"], function (_exports, _uiAccordion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiAccordion.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-checkbox", ["exports", "semantic-ui-ember/components/ui-checkbox"], function (_exports, _uiCheckbox) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiCheckbox.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-dimmer", ["exports", "semantic-ui-ember/components/ui-dimmer"], function (_exports, _uiDimmer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiDimmer.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-dropdown", ["exports", "semantic-ui-ember/components/ui-dropdown"], function (_exports, _uiDropdown) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiDropdown.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-embed", ["exports", "semantic-ui-ember/components/ui-embed"], function (_exports, _uiEmbed) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiEmbed.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-modal", ["exports", "semantic-ui-ember/components/ui-modal"], function (_exports, _uiModal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiModal.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-nag", ["exports", "semantic-ui-ember/components/ui-nag"], function (_exports, _uiNag) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiNag.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-popup", ["exports", "semantic-ui-ember/components/ui-popup"], function (_exports, _uiPopup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiPopup.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-progress", ["exports", "semantic-ui-ember/components/ui-progress"], function (_exports, _uiProgress) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiProgress.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-radio", ["exports", "semantic-ui-ember/components/ui-radio"], function (_exports, _uiRadio) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiRadio.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-rating", ["exports", "semantic-ui-ember/components/ui-rating"], function (_exports, _uiRating) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiRating.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-search", ["exports", "semantic-ui-ember/components/ui-search"], function (_exports, _uiSearch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiSearch.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-shape", ["exports", "semantic-ui-ember/components/ui-shape"], function (_exports, _uiShape) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiShape.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-sidebar", ["exports", "semantic-ui-ember/components/ui-sidebar"], function (_exports, _uiSidebar) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiSidebar.default;
    }
  });
});
;define("aouda-ceams-frontend/components/ui-sticky", ["exports", "semantic-ui-ember/components/ui-sticky"], function (_exports, _uiSticky) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _uiSticky.default;
    }
  });
});
;define("aouda-ceams-frontend/components/user-manager", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    init() {
      this._super(...arguments);

      this.set('changes', {});
      this.set('allUsersFilter', '');
      this.set('membersFilter', '');
    },

    allUsers: Ember.computed('users.allUsers', 'users.members', 'allUsersFilter', function () {
      return this.users.allUsers.filter(u => {
        return (u.firstName + " " + u.lastName).startsWith(this.get('allUsersFilter'));
      });
    }),
    members: Ember.computed('users.members', 'users.allUsers', 'membersFilter', function () {
      return this.users.members.filter(u => {
        return (u.firstName + " " + u.lastName).startsWith(this.get('membersFilter'));
      });
    }),
    actions: {
      add(user) {
        let key = `changes.${user._id}`;

        if (this.get(key) == 'remove') {
          this.set(key, undefined); // if already on remove list, remove entry
        } else {
          this.set(key, 'add');
        }

        this.set('users.allUsers', this.get('users.allUsers').filter(u => {
          return user._id != u._id;
        }));
        this.get('users.members').pushObject(user);
        this.set('allUsersFilter', '');
        this.set('membersFilter', '');
      },

      remove(user) {
        let key = `changes.${user._id}`;

        if (this.get(key) == 'add') {
          this.set(key, undefined); // if already on add list, remove entry
        } else {
          this.set(key, 'remove');
        }

        this.set('users.members', this.get('users.members').filter(u => {
          return user._id != u._id;
        }));
        this.get('users.allUsers').pushObject(user);
      },

      filterAllUsers(e) {
        this.set('allUsersFilter', e.target.value);
      },

      filtermembers(e) {
        this.set('membersFilter', e.target.value);
      },

      submit() {
        this.submit(this.get('changes'));
      }

    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/view-meeting", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    DS: Ember.inject.service('store'),
    modalName: Ember.computed(function () {
      return 'newMeeting' + this.get('ID');
    }),
    actions: {
      edit: function () {
        Ember.$('#editBtn').click(function () {
          Ember.$('.meetingInput').prop("readonly", false);
        });
      },
      closeModal: function () {
        Ember.$('.ui.' + this.get('modalName') + '.modal').modal('hide');
      },
      openModal: function () {
        /*
            instead of null, must put in onePost.meetingTitle.... 
            that is passed from template meeting
        */
        this.set('meetingTitle', null);
        this.set('meetingPlace', null);
        this.set('meetingObjective', null);
        this.set('meetingDescription', null);
        this.set('otherDetail', null);
        this.set('recommendations', null);
        this.set('decisions', null);
        Ember.$('.ui.' + this.get('modalName') + '.modal').addClass('scrollME');
        Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
          closable: false,
          onDeny: () => {
            return true;
          },
          onApprove: () => {
            var newMeetingMinute = this.get('DS').createRecord('meeting-minutes', {
              meetingTitle: this.get('meetingTitle'),
              meetingPlace: this.get('meetingPlace'),
              meetingObjective: this.get('meetingObjective'),
              meetingDescription: this.get('meetingDescription'),
              otherDetail: this.get('otherDetail'),
              recommendations: this.get('recommendations'),
              decisions: this.get('decisions')
            });
            newMeetingMinute.save().then(() => {
              return true;
            });
            var newMeeting = this.get('DS').createRecord('meetings', {
              startDateTime: this.get('startDateTime'),
              endDateTime: this.get('endDateTime')
            });
            newMeeting.save().then(() => {
              return true;
            });
          }
        }).modal('show');
      }
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/components/welcome-page", ["exports", "ember-welcome-page/components/welcome-page"], function (_exports, _welcomePage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
;define("aouda-ceams-frontend/controllers/committees/manage-users", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    init() {
      this._super(...arguments);
    },

    actions: {
      processChanges(changes) {
        console.log(changes);
      }

    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/helpers/and", ["exports", "ember-truth-helpers/helpers/and"], function (_exports, _and) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _and.default;
    }
  });
  Object.defineProperty(_exports, "and", {
    enumerable: true,
    get: function () {
      return _and.and;
    }
  });
});
;define("aouda-ceams-frontend/helpers/app-version", ["exports", "aouda-ceams-frontend/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("aouda-ceams-frontend/helpers/eq", ["exports", "ember-truth-helpers/helpers/equal"], function (_exports, _equal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _equal.default;
    }
  });
  Object.defineProperty(_exports, "equal", {
    enumerable: true,
    get: function () {
      return _equal.equal;
    }
  });
});
;define("aouda-ceams-frontend/helpers/gt", ["exports", "ember-truth-helpers/helpers/gt"], function (_exports, _gt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _gt.default;
    }
  });
  Object.defineProperty(_exports, "gt", {
    enumerable: true,
    get: function () {
      return _gt.gt;
    }
  });
});
;define("aouda-ceams-frontend/helpers/gte", ["exports", "ember-truth-helpers/helpers/gte"], function (_exports, _gte) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _gte.default;
    }
  });
  Object.defineProperty(_exports, "gte", {
    enumerable: true,
    get: function () {
      return _gte.gte;
    }
  });
});
;define("aouda-ceams-frontend/helpers/is-array", ["exports", "ember-truth-helpers/helpers/is-array"], function (_exports, _isArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isArray.default;
    }
  });
  Object.defineProperty(_exports, "isArray", {
    enumerable: true,
    get: function () {
      return _isArray.isArray;
    }
  });
});
;define("aouda-ceams-frontend/helpers/is-empty", ["exports", "ember-truth-helpers/helpers/is-empty"], function (_exports, _isEmpty) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isEmpty.default;
    }
  });
});
;define("aouda-ceams-frontend/helpers/is-equal", ["exports", "ember-truth-helpers/helpers/is-equal"], function (_exports, _isEqual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(_exports, "isEqual", {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
;define("aouda-ceams-frontend/helpers/lt", ["exports", "ember-truth-helpers/helpers/lt"], function (_exports, _lt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _lt.default;
    }
  });
  Object.defineProperty(_exports, "lt", {
    enumerable: true,
    get: function () {
      return _lt.lt;
    }
  });
});
;define("aouda-ceams-frontend/helpers/lte", ["exports", "ember-truth-helpers/helpers/lte"], function (_exports, _lte) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _lte.default;
    }
  });
  Object.defineProperty(_exports, "lte", {
    enumerable: true,
    get: function () {
      return _lte.lte;
    }
  });
});
;define("aouda-ceams-frontend/helpers/map-value", ["exports", "semantic-ui-ember/helpers/map-value"], function (_exports, _mapValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _mapValue.default;
    }
  });
  Object.defineProperty(_exports, "mapValue", {
    enumerable: true,
    get: function () {
      return _mapValue.mapValue;
    }
  });
});
;define("aouda-ceams-frontend/helpers/not-eq", ["exports", "ember-truth-helpers/helpers/not-equal"], function (_exports, _notEqual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notEqual.default;
    }
  });
  Object.defineProperty(_exports, "notEq", {
    enumerable: true,
    get: function () {
      return _notEqual.notEq;
    }
  });
});
;define("aouda-ceams-frontend/helpers/not", ["exports", "ember-truth-helpers/helpers/not"], function (_exports, _not) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _not.default;
    }
  });
  Object.defineProperty(_exports, "not", {
    enumerable: true,
    get: function () {
      return _not.not;
    }
  });
});
;define("aouda-ceams-frontend/helpers/or", ["exports", "ember-truth-helpers/helpers/or"], function (_exports, _or) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _or.default;
    }
  });
  Object.defineProperty(_exports, "or", {
    enumerable: true,
    get: function () {
      return _or.or;
    }
  });
});
;define("aouda-ceams-frontend/helpers/pluralize", ["exports", "ember-inflector/lib/helpers/pluralize"], function (_exports, _pluralize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _pluralize.default;
  _exports.default = _default;
});
;define("aouda-ceams-frontend/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("aouda-ceams-frontend/helpers/xor", ["exports", "ember-truth-helpers/helpers/xor"], function (_exports, _xor) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _xor.default;
    }
  });
  Object.defineProperty(_exports, "xor", {
    enumerable: true,
    get: function () {
      return _xor.xor;
    }
  });
});
;define("aouda-ceams-frontend/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "aouda-ceams-frontend/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("aouda-ceams-frontend/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("aouda-ceams-frontend/initializers/ember-data", ["exports", "ember-data/setup-container", "ember-data"], function (_exports, _setupContainer, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
      adapter: 'custom'
    });
    ```
  
    ```app/controllers/posts.js
    import { Controller } from '@ember/controller';
  
    export default Controller.extend({
      // ...
    });
  
    When the application is initialized, `ApplicationStore` will automatically be
    instantiated, and the instance of `PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */
  var _default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
  _exports.default = _default;
});
;define("aouda-ceams-frontend/initializers/export-application-global", ["exports", "aouda-ceams-frontend/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("aouda-ceams-frontend/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (_exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
  _exports.default = _default;
});
;define("aouda-ceams-frontend/mixins/base", ["exports", "semantic-ui-ember/mixins/base"], function (_exports, _base) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _base.default;
    }
  });
});
;define("aouda-ceams-frontend/models/instructor", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    firstName: _emberData.default.attr(),
    lastName: _emberData.default.attr(),
    email: _emberData.default.attr(),
    building: _emberData.default.attr(),
    officeNumber: _emberData.default.attr(),
    number: _emberData.default.attr(),
    CCMemberStatus: _emberData.default.attr(),
    hireDate: _emberData.default.attr(),
    estimatedRetirementDate: _emberData.default.attr(),
    keyPerformanceIndicator: _emberData.default.attr(),
    userGivenRoles: _emberData.default.hasmany('user-given-role'),
    membersAttendingMeeting: _emberData.default.hasmany('member-attending-meeting'),
    userEvaluationMethod: _emberData.default.belongsto('user-evaluation-method'),
    licenceStatuses: _emberData.default.hasmany('licence-status'),
    academicRank: _emberData.default.belongstp('academic-rank'),
    academicDegrees: _emberData.default.hasmany('academic-degree'),
    semester: _emberData.default.hasmany('semester'),
    program: _emberData.default.hasmany('program'),
    userAccount: _emberData.default.belongsto('user-account')
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/models/meeting-minutes", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    meetingTitle: _emberData.default.attr(),
    meetingPlace: _emberData.default.attr(),
    meetingObjective: _emberData.default.attr(),
    meetingDescription: _emberData.default.attr(),
    otherDetail: _emberData.default.attr(),
    recommendation: _emberData.default.attr(),
    decision: _emberData.default.attr(),
    meetingTopic: _emberData.default.hasMany('MeetingTopics'),
    meetings: _emberData.default.hasMany('Meetings'),
    memberAttended: _emberData.default.hasMany('MembersAttended')
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/models/meeting", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    startDateTime: _emberData.default.attr(),
    endDateTime: _emberData.default.attr(),
    memberAttendingMeeting: _emberData.default.belongsTo('MemberAttendingMeetings'),
    meetingMinutes: _emberData.default.belongsTo('MeetingMinutes')
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/models/member-attending-meeting", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    participationStartDate: _emberData.default.attr(),
    participationEndDate: _emberData.default.attr(),
    memberRole: _emberData.default.attr(),
    committeeName: _emberData.default.attr(),
    committeeLevel: _emberData.default.attr(),
    instructor: _emberData.default.belongsto('instructor'),
    staff: _emberData.default.belongsto('staff'),
    teachingAssistant: _emberData.default.belongsto('teaching-assistant')
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/models/staff", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    firstName: _emberData.default.attr(),
    lastName: _emberData.default.attr(),
    email: _emberData.default.attr(),
    building: _emberData.default.attr(),
    officeNumber: _emberData.default.attr(),
    roleName: _emberData.default.attr(),
    keyPerformanceIndicator: _emberData.default.attr(),
    userEvaluationMethod: _emberData.default.belongsto('user-evaluation-method'),
    userGivenRoles: _emberData.default.hasmany('user-given-role'),
    userAccount: _emberData.default.belongsto('user-account'),
    membersAttendingMeeting: _emberData.default.hasmany('member-attending-meeting')
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/models/teaching-assistant", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    firstName: _emberData.default.attr(),
    lastName: _emberData.default.attr(),
    email: _emberData.default.attr(),
    building: _emberData.default.attr(),
    officeNumber: _emberData.default.attr(),
    contactInfo: _emberData.default.attr(),
    userGivenRoles: _emberData.default.hasmany('user-given-role'),
    userAccount: _emberData.default.belongsto('user-account'),
    membersAttendingMeeting: _emberData.default.hasmany('member-attending-meeting')
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/models/team-detail", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.Model.extend({
    committeeName: _emberData.default.attr(String),
    committeeLevel: _emberData.default.attr(String),
    member: _emberData.default.attr(String)
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("aouda-ceams-frontend/router", ["exports", "aouda-ceams-frontend/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {
    this.route('main-menu');
    this.route('home-page', {
      path: '/'
    });
    this.route('login');
    this.route('team-detail');
    this.route('meeting');
    this.route('task-force-management');
    this.route('committee');
    this.route('new-task-force');
    this.route('committees', function () {
      this.route('detail');
      this.route('manage-users');
    });
  });
  var _default = Router;
  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/committees/detail", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/committees/manage-users", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    model() {
      return {
        allUsers: [{
          _id: "wiofvnewoi",
          firstName: "Jason",
          lastName: "Chin",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "asghfddsf",
          firstName: "Welson",
          lastName: "Wei",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "asdfgdsfawfd",
          firstName: "Evan",
          lastName: "Hutnik",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "hhrtfsdgs",
          firstName: "Billy",
          lastName: "Fincher",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }],
        members: [{
          _id: "43tgrarg",
          firstName: "Jake",
          lastName: "Prouse",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "f43gagaaa",
          firstName: "Jonathan",
          lastName: "Hay",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }]
      };
    }

  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/ga-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/home-page", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/login", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/main-menu", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/meeting", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    model() {
      return {
        allUsers: [{
          _id: "wiofvnewoi",
          firstName: "Jason",
          lastName: "Chin",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "asghfddsf",
          firstName: "Welson",
          lastName: "Wei",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "asdfgdsfawfd",
          firstName: "Evan",
          lastName: "Hutnik",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "hhrtfsdgs",
          firstName: "Billy",
          lastName: "Fincher",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }],
        members: [{
          _id: "43tgrarg",
          firstName: "Jake",
          lastName: "Prouse",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }, {
          _id: "f43gagaaa",
          firstName: "Jonathan",
          lastName: "Hay",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }]
      };
    }

  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/new-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/routes/task-force-management", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({});

  _exports.default = _default;
});
;define("aouda-ceams-frontend/serializers/application", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberData.default.JSONAPISerializer.extend({
    primaryKey: '_id'
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("aouda-ceams-frontend/templates/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "K5cHoxqV",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"outlet\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/application.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/committees/detail", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "II3Ppidt",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"committees/team-detail\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/committees/detail.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/committees/manage-users", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "5v8DfTiD",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"nav-bar\"],false],[0,\"\\n\\n\"],[1,[27,\"committees/manage-users\",null,[[\"users\",\"processChanges\"],[[22,0,[\"model\"]],[27,\"action\",[[22,0,[]],\"processChanges\"],null]]]],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/committees/manage-users.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/committees/manage-users", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "Q3jXBN03",
    "block": "{\"symbols\":[],\"statements\":[[1,[27,\"user-manager\",null,[[\"users\",\"submit\"],[[23,[\"users\"]],[23,[\"processChanges\"]]]]],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/committees/manage-users.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/committees/team-detail", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "0oaMHDXW",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"nav-bar\"],false],[0,\"\\n\\n\"],[7,\"div\"],[11,\"class\",\"team-detail\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"ui two column centered grid\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui column centered grid\"],[9],[0,\"\\n                \"],[7,\"div\"],[11,\"class\",\"ui text container\"],[9],[0,\"\\n                    \"],[7,\"h1\"],[9],[0,\"GA Task Force\"],[10],[0,\"\\n                \"],[10],[0,\"\\n            \"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui grid\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"four column row\"],[9],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"left floated column\"],[9],[0,\"\\n                 \"],[7,\"div\"],[11,\"class\",\"top\"],[9],[0,\"\\n                    \"],[7,\"div\"],[11,\"class\",\"ui medium rectangle\"],[9],[0,\"\\n                      \"],[7,\"span\"],[11,\"class\",\"committee-name\"],[9],[0,\"\\n                        \"],[7,\"p\"],[9],[0,\"Committee Name: Team3\"],[10],[0,\"\\n                      \"],[10],[0,\"\\n                      \"],[7,\"span\"],[11,\"class\",\"committee-level\"],[9],[0,\"\\n                        \"],[7,\"p\"],[9],[0,\"Committee Level: Department\"],[10],[0,\"\\n                      \"],[10],[0,\"\\n                    \"],[10],[0,\"\\n                \"],[10],[0,\"\\n              \"],[10],[0,\"\\n                \"],[7,\"div\"],[11,\"class\",\"right floated column\"],[9],[0,\"\\n                  \"],[7,\"div\"],[11,\"class\",\"ui right floated button\"],[9],[0,\"\\n                    \"],[4,\"link-to\",[\"committees.manage-users\"],[[\"class\"],[\"item\"]],{\"statements\":[[7,\"a\"],[9],[0,\"Manage Users\"],[10]],\"parameters\":[]},null],[0,\"\\n                  \"],[10],[0,\"\\n                \"],[10],[0,\"\\n            \"],[10],[0,\"\\n        \"],[10],[0,\"  \\n\\n        \"],[7,\"div\"],[11,\"class\",\"ui divider\"],[9],[10],[0,\"\\n\\n            \"],[7,\"div\"],[11,\"class\",\"bottom\"],[9],[0,\"\\n                \"],[7,\"div\"],[11,\"class\",\"ui relaxed divided list\"],[9],[0,\"\\n                  \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n                    \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n                    \"],[7,\"a\"],[11,\"class\",\"header\"],[9],[0,\"Welson\"],[10],[0,\"\\n                    \"],[7,\"div\"],[11,\"class\",\"description\"],[9],[0,\"Member of Team3\"],[10],[0,\"\\n                    \"],[10],[0,\"\\n                  \"],[10],[0,\"\\n                \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n                    \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n                    \"],[7,\"a\"],[11,\"class\",\"header\"],[9],[0,\"Jason\"],[10],[0,\"\\n                    \"],[7,\"div\"],[11,\"class\",\"description\"],[9],[0,\"Member of Team3\"],[10],[0,\"\\n                    \"],[10],[0,\"\\n                \"],[10],[0,\"\\n                   \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n                      \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n                        \"],[7,\"a\"],[11,\"class\",\"header\"],[9],[0,\"Jonathan\"],[10],[0,\"\\n                        \"],[7,\"div\"],[11,\"class\",\"description\"],[9],[0,\"Member of Team3\"],[10],[0,\"\\n                      \"],[10],[0,\"\\n                   \"],[10],[0,\"\\n                \"],[10],[0,\"\\n            \"],[10],[0,\"\\n        \"],[10],[0,\"\\n    \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/committees/team-detail.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/ga-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "B5P1Hdux",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[14,1]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/ga-task-force.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/home-page", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "XP/Vksyy",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"home page\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui inverted vertical center aligned segment\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"ui massive borderless attached inverted menu\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"header item\"],[9],[0,\"\\n        \"],[7,\"img\"],[11,\"class\",\"ui medium image\"],[12,\"src\",[28,[[21,\"rootURL\"],\"assets\\\\images\\\\Western-logo-Engineering.png\"]]],[11,\"alt\",\"\"],[9],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"right item\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui massive secondary attached inverted pointing menu\"],[9],[0,\"\\n          \"],[4,\"link-to\",[\"login\"],null,{\"statements\":[[7,\"a\"],[11,\"class\",\" item\"],[9],[0,\"Login\"],[10]],\"parameters\":[]},null],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"ui text container\"],[9],[0,\"\\n      \"],[7,\"h1\"],[11,\"class\",\"ui inverted header\"],[9],[0,\"\\n        CEAMS\\n      \"],[10],[0,\"\\n      \"],[7,\"p\"],[9],[0,\"\\n        Canadian Engineering Accreditation Management System (CEAMS) is a software system that facilitate the\\n        management, measurement, and visualization of the outcomes-based\\n        assessment and continuous program improvement for the Canadian Engineering Universities.\\n      \"],[10],[0,\"\\n\"],[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"class\",\"ui massive white button\"],[9],[0,\"\\n          Let's Get Started\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"ui inverted footer segment\"],[9],[0,\"\\n      CEAMS project developed by \"],[7,\"a\"],[9],[0,\"SE3350b Class 2019\"],[10],[0,\", supervised by\\n      \"],[7,\"a\"],[9],[0,\"Dr. Abdelkader Ouda\"],[10],[0,\".\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/home-page.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/log-in", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "PjZcYS+z",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"login\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui middle aligned center aligned grid\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n      \"],[7,\"h2\"],[11,\"class\",\"ui teal image header\"],[9],[0,\"\\n        \"],[7,\"img\"],[11,\"class\",\"image\"],[12,\"src\",[28,[[21,\"rootURL\"],\"assets\\\\images\\\\Western Logo.png\"]]],[11,\"alt\",\"\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n          Log-in to your account\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n\\n      \"],[7,\"form\"],[11,\"class\",\"ui large form\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui stacked segment\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"field\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui left icon input\"],[9],[0,\"\\n              \"],[7,\"i\"],[11,\"class\",\"user icon\"],[9],[10],[0,\"\\n              \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[23,[\"name\"]],\"text\",\"Username\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"field\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui left icon input\"],[9],[0,\"\\n              \"],[7,\"i\"],[11,\"class\",\"lock icon\"],[9],[10],[0,\"\\n              \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[23,[\"password\"]],\"password\",\"Password\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"button\"],[11,\"class\",\"ui fluid large teal submit button\"],[9],[0,\"\\n            Login\\n          \"],[3,\"action\",[[22,0,[]],\"login\"]],[10],[0,\"\\n        \"],[10],[0,\"\\n\\n        \"],[7,\"p\"],[11,\"class\",\"error\"],[9],[0,\" \"],[1,[21,\"errorMessage\"],false],[10],[0,\"\\n\\n      \"],[10],[0,\"\\n\\n      \"],[7,\"div\"],[11,\"class\",\"ui message\"],[9],[0,\"\\n        New to us?\"],[7,\"a\"],[11,\"href\",\"#\"],[9],[0,\" Sign Up\"],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/log-in.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/main-menu", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "xnY/u8OH",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"nav-bar\"],false],[0,\"\\n\\n\"],[7,\"div\"],[11,\"class\",\"ui stackable grid container\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"computer only row\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"thirteen wide column\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui message\"],[9],[0,\"\\n        \"],[7,\"h1\"],[11,\"class\",\"ui huge header\"],[9],[0,\"\\n          Hello, SE3350b Teams!\\n        \"],[10],[0,\"\\n        \"],[7,\"p\"],[11,\"class\",\"lead\"],[9],[0,\"\\n          This is a simple example to show the Semantic-UI pattern we will use through out CEAMS project,\\n          click the green button to see the left sidebar coming in and out of the page, and try to change\\n          the browser size to see right sidebar toggle button. You could check out more wonderful effects here:\\n          \"],[7,\"a\"],[11,\"target\",\"_blank\"],[11,\"href\",\"http://semantic-ui.com/modules/sidebar.html#/examples\"],[11,\"rel\",\"noopener\"],[9],[0,\"Semantic-UI/sidebar examples\"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui hidden divider\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui green button\"],[9],[0,\"\\n          \"],[7,\"i\"],[11,\"class\",\"left arrow icon\"],[9],[10],[0,\" Toggle left sidebar\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui hidden section divider\"],[9],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui stackable grid\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"three column row\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n              Heading\\n            \"],[10],[0,\"\\n            \"],[7,\"p\"],[9],[0,\"\\n              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris\\n              condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis\\n              euismod. Donec sed odio dui.\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n              View detailes »\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n              Heading\\n            \"],[10],[0,\"\\n            \"],[7,\"p\"],[9],[0,\"\\n              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris\\n              condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis\\n              euismod. Donec sed odio dui.\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n              View detailes »\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n              Heading\\n            \"],[10],[0,\"\\n            \"],[7,\"p\"],[9],[0,\"\\n              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris\\n              condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis\\n              euismod. Donec sed odio dui.\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n              View detailes »\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"three column row\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n              Heading\\n            \"],[10],[0,\"\\n            \"],[7,\"p\"],[9],[0,\"\\n              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris\\n              condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis\\n              euismod. Donec sed odio dui.\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n              View detailes »\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n              Heading\\n            \"],[10],[0,\"\\n            \"],[7,\"p\"],[9],[0,\"\\n              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris\\n              condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis\\n              euismod. Donec sed odio dui.\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n              View detailes »\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n            \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n              Heading\\n            \"],[10],[0,\"\\n            \"],[7,\"p\"],[9],[0,\"\\n              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris\\n              condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis\\n              euismod. Donec sed odio dui.\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n              View detailes »\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui hidden divider\"],[9],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui divider\"],[9],[10],[0,\"\\n      \"],[7,\"footer\"],[9],[0,\"\\n        © 2019 SE3350b Class\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"three wide column\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui vertical menu\"],[9],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"active item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\\n  \"],[7,\"div\"],[11,\"class\",\"tablet mobile only row pushable\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"ui basic segment pusher\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui container\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui message\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui blue right floated icon button\"],[9],[0,\"\\n            Toggle right sidebar\"],[7,\"i\"],[11,\"class\",\"right arrow icon\"],[9],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"h1\"],[11,\"class\",\"ui huge header\"],[9],[0,\"\\n            Hello, world!\\n          \"],[10],[0,\"\\n          \"],[7,\"p\"],[11,\"class\",\"lead\"],[9],[0,\"\\n            This is a simple example to show the Semantic-UI pattern we will use through out CEAMS project,\\n            click the green button to see the left sidebar coming in and out of the page, and try to change\\n            the browser size to see right sidebar toggle button. You could check out more wonderful effects here:\\n            \"],[7,\"a\"],[11,\"target\",\"_blank\"],[11,\"href\",\"http://semantic-ui.com/modules/sidebar.html#/examples\"],[11,\"rel\",\"noopener\"],[9],[0,\"Semantic-UI/sidebar examples\"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui hidden divider\"],[9],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui green button\"],[9],[0,\"\\n            \"],[7,\"i\"],[11,\"class\",\"left arrow icon\"],[9],[10],[0,\" Toggle left sidebar\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui hidden section divider\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui stackable grid\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"three column row\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n              \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n                Heading\\n              \"],[10],[0,\"\\n              \"],[7,\"p\"],[9],[0,\"\\n                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor\\n                mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna\\n                mollis euismod. Donec sed odio dui.\\n              \"],[10],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n                View detailes »\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n              \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n                Heading\\n              \"],[10],[0,\"\\n              \"],[7,\"p\"],[9],[0,\"\\n                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor\\n                mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna\\n                mollis euismod. Donec sed odio dui.\\n              \"],[10],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n                View detailes »\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n              \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n                Heading\\n              \"],[10],[0,\"\\n              \"],[7,\"p\"],[9],[0,\"\\n                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor\\n                mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna\\n                mollis euismod. Donec sed odio dui.\\n              \"],[10],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n                View detailes »\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"three column row\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n              \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n                Heading\\n              \"],[10],[0,\"\\n              \"],[7,\"p\"],[9],[0,\"\\n                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor\\n                mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna\\n                mollis euismod. Donec sed odio dui.\\n              \"],[10],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n                View detailes »\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n              \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n                Heading\\n              \"],[10],[0,\"\\n              \"],[7,\"p\"],[9],[0,\"\\n                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor\\n                mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna\\n                mollis euismod. Donec sed odio dui.\\n              \"],[10],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n                View detailes »\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n              \"],[7,\"h1\"],[11,\"class\",\"ui header\"],[9],[0,\"\\n                Heading\\n              \"],[10],[0,\"\\n              \"],[7,\"p\"],[9],[0,\"\\n                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor\\n                mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna\\n                mollis euismod. Donec sed odio dui.\\n              \"],[10],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"ui small basic button\"],[9],[0,\"\\n                View detailes »\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui hidden divider\"],[9],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui divider\"],[9],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui basic footer segment\"],[9],[0,\"\\n        \"],[7,\"p\"],[9],[0,\"\\n          © 2019 SE3350b Class\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n\\n    \"],[10],[0,\"\\n\\n\\n    \"],[7,\"div\"],[11,\"class\",\"ui right sidebar vertical menu\"],[9],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"active item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Link\"],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n\\n  \"],[10],[0,\"\\n\"],[10],[0,\"\\n\\n\\n\"],[7,\"div\"],[11,\"class\",\"ui left inverted labeled icon inline vertical menu sidebar\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui section hidden divider\"],[9],[0,\"\\n\\n  \"],[10],[0,\"\\n\\n\"],[4,\"link-to\",[\"home-page\"],null,{\"statements\":[[0,\"  \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n    \"],[7,\"i\"],[11,\"class\",\"home icon\"],[9],[10],[0,\"\\n    Home\\n  \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n  \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"\\n    \"],[7,\"i\"],[11,\"class\",\"block layout icon\"],[9],[10],[0,\"Topics\\n  \"],[10],[0,\"\\n  \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"\\n    \"],[7,\"i\"],[11,\"class\",\"smile icon\"],[9],[10],[0,\"Friends\\n  \"],[10],[0,\"\\n\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/main-menu.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/meeting-component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "lnrD0V+q",
    "block": "{\"symbols\":[\"onePost\"],\"statements\":[[4,\"each\",[[23,[\"model\"]]],null,{\"statements\":[[7,\"li\"],[9],[1,[22,1,[\"id\"]],false],[0,\" \"],[10],[0,\"\\n\"],[7,\"li\"],[9],[1,[22,1,[\"startDateTime\"]],false],[0,\" \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/meeting-component.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/nav-bar", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "j09wVeLa",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"ui top fixed borderless huge inverted menu\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui container grid\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"computer only row\"],[9],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"header item\"],[9],[0,\"CEAMS\"],[10],[0,\"\\n      \"],[4,\"link-to\",[\"home-page\"],[[\"class\"],[\"item\"]],{\"statements\":[[7,\"a\"],[9],[0,\"Home\"],[10]],\"parameters\":[]},null],[0,\"\\n      \"],[4,\"link-to\",[\"task-force-management\"],[[\"class\"],[\"item\"]],{\"statements\":[[7,\"a\"],[9],[0,\"Committees\"],[10]],\"parameters\":[]},null],[0,\"\\n      \"],[4,\"link-to\",[\"meeting\"],[[\"class\"],[\"item\"]],{\"statements\":[[7,\"a\"],[9],[0,\"Meeting\"],[10]],\"parameters\":[]},null],[0,\"\\n    \"],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"tablet mobile only row\"],[9],[0,\"\\n      \"],[7,\"a\"],[11,\"class\",\"header item\"],[9],[0,\" CEAMS\"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"right menu\"],[9],[0,\"\\n        \"],[7,\"a\"],[11,\"class\",\"menu item\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui icon toggle basic inverted button\"],[9],[0,\"\\n            \"],[7,\"i\"],[11,\"class\",\"content large icon\"],[9],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui vertical borderless fluid inverted menu\"],[9],[0,\"\\n        \"],[4,\"link-to\",[\"home-page\"],null,{\"statements\":[[0,\" \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"Home\"],[10]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"link-to\",[\"task-force-management\"],[[\"class\"],[\"item\"]],{\"statements\":[[7,\"a\"],[9],[0,\"Committees\"],[10]],\"parameters\":[]},null],[0,\"\\n        \"],[4,\"link-to\",[\"meeting\"],[[\"class\"],[\"item\"]],{\"statements\":[[7,\"a\"],[9],[0,\"Meeting\"],[10]],\"parameters\":[]},null],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/nav-bar.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/new-meeting", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "Hnw+8kML",
    "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[7,\"div\"],[11,\"class\",\"ui blue button\"],[9],[0,\"\\n  New Meeting\\n\"],[3,\"action\",[[22,0,[]],\"openModal\"]],[10],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"newMeeting\",\"newMeeting\"]],{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n      \"],[7,\"h1\"],[9],[0,\"New Meeting\"],[10],[0,\"\\n      \"],[7,\"br\"],[9],[10],[0,\"\\n      \"],[7,\"label\"],[9],[0,\"Meeting Title\"],[10],[0,\"\\n    \"],[10],[0,\"\\n    \"],[7,\"br\"],[9],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingTitle\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"Meeting Place\"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingPlace\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"Meeting Objective\"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingObjective\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"Meeting Description\"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingDescription\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"Other Details\"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"otherDetails\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"Start Time\"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"startDateTime\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"End Time\"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"endDateTime\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n        \"],[7,\"br\"],[9],[10],[0,\"\\n    \"],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"actions\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui primary button\"],[9],[0,\"\\n          Create Meeting\\n      \"],[3,\"action\",[[22,0,[]],\"create\"]],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui red button\"],[9],[0,\"\\n        Close\\n      \"],[3,\"action\",[[22,0,[]],\"closeModal\"]],[10],[0,\"\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/new-meeting.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/new-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "QCIOnAMf",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"ui middle aligned center aligned grid\"],[11,\"id\",\"createElement\"],[9],[0,\"\\n\"],[7,\"div\"],[11,\"class\",\"six wide column\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n      Adding new task force\\n    \"],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"ui form\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"field\"],[9],[0,\"\\n          \"],[7,\"label\"],[9],[0,\"Task Force Name\"],[10],[0,\"\\n          \"],[1,[27,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[23,[\"title\"]],\"add title\"]]],false],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n    \"],[7,\"br\"],[9],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"actions\"],[9],[0,\"\\n\"],[4,\"link-to\",[\"task-force-management\"],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"class\",\"ui black deny button\"],[9],[0,\"\\n          Cancel\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"link-to\",[\"task-force-management\"],null,{\"statements\":[[0,\"        \"],[7,\"button\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"add\",[23,[\"placeholder\"]]],null]],[11,\"class\",\"ui positive right labeled icon button\"],[9],[0,\"\\n          Save\\n          \"],[7,\"i\"],[11,\"class\",\"checkmark icon\"],[9],[10],[0,\"\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/new-task-force.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/task-force-management", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "0sa2GA+7",
    "block": "{\"symbols\":[\"committee\"],\"statements\":[[7,\"div\"],[11,\"class\",\"ui middle aligned center aligned grid\"],[9],[0,\"\\n  \"],[7,\"br\"],[9],[10],[7,\"br\"],[9],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"six wide column\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n        \"],[7,\"h1\"],[11,\"class\",\"centered\"],[11,\"id\",\"title\"],[9],[0,\"GA COMMITTEES AND TASK FORCE MANAGEMENT\"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"row\"],[11,\"id\",\"ForceList\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui raised segment divided very relaxed animated list\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n                TASK FORCE DELTA 747\\n                \"],[7,\"div\"],[11,\"class\",\"ui teal button\"],[9],[0,\"\\n                  View\\n                \"],[10],[0,\"\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n                Party Planning Committee\\n                \"],[7,\"div\"],[11,\"class\",\"ui right-align teal button\"],[9],[0,\"\\n                  View\\n                \"],[10],[0,\"\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n                Project Management Ideas\\n                \"],[7,\"div\"],[11,\"class\",\"ui right-align teal button\"],[9],[0,\"\\n                  View\\n                \"],[10],[0,\"\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n\"],[4,\"each\",[[22,0,[\"allCommittees\"]]],null,{\"statements\":[[0,\"          \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n              \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n                \"],[1,[22,1,[\"name\"]],false],[0,\"\\n                \"],[7,\"div\"],[11,\"class\",\"ui right-align teal button\"],[9],[0,\"\\n                  View\\n                \"],[10],[0,\"\\n              \"],[10],[0,\"\\n            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"      \"],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n\"],[4,\"link-to\",[\"new-task-force\"],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"class\",\"ui red button\"],[9],[0,\"\\n          New\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/task-force-management.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/user-manager", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "QHqKk52L",
    "block": "{\"symbols\":[\"user\",\"user\"],\"statements\":[[7,\"div\"],[11,\"class\",\"content-container manage-users\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui row centered grid\"],[9],[0,\"\\n    \"],[7,\"h1\"],[11,\"class\",\"header\"],[9],[0,\"Manage Users\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui centered grid\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"eight wide row\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"six wide column\"],[9],[0,\"\\n        \"],[7,\"h3\"],[11,\"class\",\"ui centered aligned header\"],[9],[0,\"All Users\"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui centered grid section\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui action input\"],[9],[0,\"\\n            \"],[7,\"input\"],[12,\"oninput\",[27,\"action\",[[22,0,[]],\"filterAllUsers\"],null]],[11,\"placeholder\",\"Search...\"],[11,\"type\",\"text\"],[9],[10],[0,\"\\n            \"],[7,\"button\"],[11,\"class\",\"ui button\"],[9],[0,\"Search\"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"section\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"user-container\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui middle aligned divided list\"],[9],[0,\"\\n\"],[4,\"each\",[[22,0,[\"allUsers\"]]],null,{\"statements\":[[0,\"                \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n                  \"],[7,\"div\"],[11,\"class\",\"left floated content username\"],[9],[0,\"\\n                    \"],[1,[22,2,[\"firstName\"]],false],[0,\" \"],[1,[22,2,[\"lastName\"]],false],[0,\"\\n                  \"],[10],[0,\"\\n                  \"],[7,\"button\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"add\",[22,2,[]]],null]],[11,\"class\",\"ui button right floated middle aligned\"],[9],[0,\"\\n                    Add\\n                  \"],[10],[0,\"\\n                \"],[10],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"six wide column\"],[9],[0,\"\\n        \"],[7,\"h3\"],[11,\"class\",\"ui centered aligned header\"],[9],[0,\"Team Members\"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui centered grid section\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"ui action input\"],[9],[0,\"\\n            \"],[7,\"input\"],[12,\"oninput\",[27,\"action\",[[22,0,[]],\"filtermembers\"],null]],[11,\"placeholder\",\"Search...\"],[11,\"type\",\"text\"],[9],[10],[0,\"\\n            \"],[7,\"button\"],[11,\"class\",\"ui button\"],[9],[0,\"Search\"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"section\"],[9],[0,\"\\n          \"],[7,\"div\"],[11,\"class\",\"user-container\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui middle aligned divided list\"],[9],[0,\"\\n\"],[4,\"each\",[[22,0,[\"members\"]]],null,{\"statements\":[[0,\"                \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n                  \"],[7,\"div\"],[11,\"class\",\"left floated content username\"],[9],[0,\"\\n                    \"],[1,[22,1,[\"firstName\"]],false],[0,\" \"],[1,[22,1,[\"lastName\"]],false],[0,\"\\n                  \"],[10],[0,\"\\n                  \"],[7,\"button\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"remove\",[22,1,[]]],null]],[11,\"class\",\"ui button right floated middle aligned\"],[9],[0,\"\\n                    Remove\\n                  \"],[10],[0,\"\\n                \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \"],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"six wide column\"],[9],[0,\"\\n        \"],[7,\"button\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"submit\"],null]],[11,\"class\",\"ui button right floated middle aligned\"],[9],[0,\"\\n          Submit\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/user-manager.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/components/view-meeting", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "G2L0040X",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"ui blue button\"],[9],[0,\"\\n  View Meeting\\n\"],[3,\"action\",[[22,0,[]],\"openModal\"]],[10],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[23,[\"modalName\"]],[23,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"header\"],[9],[0,\"\\n         \"],[7,\"label\"],[9],[0,\"Meeting Title\"],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingTitle\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"label\"],[9],[0,\"Meeting Place\"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingPlace\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"label\"],[9],[0,\"Meeting Objective\"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingObjective\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"label\"],[9],[0,\"Meeting Description\"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"meetingDescription\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"label\"],[9],[0,\"Other Details\"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"otherDetails\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"label\"],[9],[0,\"Start Time\"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"startDateTime\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"label\"],[9],[0,\"End Time\"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"div\"],[11,\"class\",\"ui labeled input\"],[9],[0,\"\\n            \"],[1,[27,\"input\",null,[[\"value\",\"type\",\"class\"],[[23,[\"endDateTime\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"h3\"],[9],[0,\"Recommendations\"],[10],[0,\"\\n            \"],[1,[27,\"textarea\",null,[[\"value\",\"type\",\"class\"],[[23,[\"recommendations\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"h3\"],[9],[0,\"Decisions\"],[10],[0,\"\\n            \"],[1,[27,\"textarea\",null,[[\"value\",\"type\",\"class\"],[[23,[\"decisions\"]],\"text\",\"meetingInput\"]]],false],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n            \"],[7,\"br\"],[9],[10],[0,\"\\n\"],[4,\"ui-accordion\",null,[[\"class\"],[\"styled\"]],{\"statements\":[[0,\"                \"],[7,\"div\"],[11,\"class\",\"title\"],[9],[0,\"\\n                    Manage Users\\n                \"],[10],[0,\"\\n                \"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n                    \"],[1,[27,\"user-manager\",null,[[\"users\",\"submit\"],[[23,[\"users\"]],[23,[\"processChanges\"]]]]],false],[0,\"\\n                \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[10],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"description\"],[9],[0,\"\\n        \\n    \"],[10],[0,\"\\n\\n      \"],[7,\"div\"],[11,\"class\",\"actions\"],[9],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui primary button\"],[11,\"id\",\"editBtn\"],[9],[0,\"\\n            Edit\\n        \"],[3,\"action\",[[22,0,[]],\"edit\"]],[10],[0,\"\\n        \"],[7,\"div\"],[11,\"class\",\"ui red button\"],[9],[0,\"\\n            Close\\n        \"],[3,\"action\",[[22,0,[]],\"closeModal\"]],[10],[0,\"\\n      \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/view-meeting.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/ga-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "8jSZV60J",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"outlet\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/ga-task-force.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/home-page", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "deIzAlWS",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"home-page\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/home-page.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/login", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "YLcrMcMv",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"log-in\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/login.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/main-menu", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "L4bdw7K+",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"main-menu\"],false],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/main-menu.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/meeting", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ZjLCJQmU",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"nav-bar\"],false],[0,\"\\n\"],[7,\"br\"],[9],[10],[0,\"\\n\"],[7,\"div\"],[11,\"class\",\"ui stackable grid container\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"computer only row\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"thirteen wide column\"],[9],[0,\"\\n        \"],[7,\"h1\"],[11,\"class\",\"ui huge header\"],[9],[0,\"\\n          Meetings\\n        \"],[10],[0,\"\\n        \"],[7,\"table\"],[11,\"id\",\"example\"],[11,\"class\",\"ui celled table\"],[11,\"style\",\"width:100%\"],[9],[0,\"\\n        \"],[7,\"thead\"],[9],[0,\"\\n            \"],[7,\"tr\"],[9],[0,\"\\n                \"],[7,\"th\"],[9],[0,\"Meeting Title\"],[10],[0,\"\\n                \"],[7,\"th\"],[9],[0,\"Meeting Place\"],[10],[0,\"\\n                \"],[7,\"th\"],[9],[0,\"Start Time\"],[10],[0,\"\\n                \"],[7,\"th\"],[9],[0,\"End Time\"],[10],[0,\"\\n                \"],[7,\"th\"],[9],[0,\"Detail\"],[10],[0,\"\\n            \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"tbody\"],[9],[0,\"\\n            \"],[7,\"tr\"],[9],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"Meeting 1\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"Place 1\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"12\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"1\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[1,[27,\"view-meeting\",null,[[\"ID\",\"users\"],[\"1\",[22,0,[\"model\"]]]]],false],[10],[0,\"\\n            \"],[10],[0,\"\\n            \"],[7,\"tr\"],[9],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"Meeting 2\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"Place 2\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"12\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[0,\"1\"],[10],[0,\"\\n                \"],[7,\"td\"],[9],[1,[27,\"view-meeting\",null,[[\"ID\",\"users\"],[\"2\",[22,0,[\"model\"]]]]],false],[10],[0,\"\\n            \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[1,[21,\"new-meeting\"],false],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10],[0,\"\\n\\n\"],[7,\"div\"],[11,\"class\",\"ui left inverted labeled icon inline vertical menu sidebar\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"ui section hidden divider\"],[9],[0,\"\\n\\n  \"],[10],[0,\"\\n\\n\"],[4,\"link-to\",[\"home-page\"],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"item\"],[9],[0,\"\\n      \"],[7,\"i\"],[11,\"class\",\"home icon\"],[9],[10],[0,\"\\n      Home\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n  \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"\\n    \"],[7,\"i\"],[11,\"class\",\"block layout icon\"],[9],[10],[0,\"Topics\\n  \"],[10],[0,\"\\n  \"],[7,\"a\"],[11,\"class\",\"item\"],[9],[0,\"\\n    \"],[7,\"i\"],[11,\"class\",\"smile icon\"],[9],[10],[0,\"Friends\\n  \"],[10],[0,\"\\n\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/meeting.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/new-task-force", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "k4jvjj1n",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"new-task-force\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/new-task-force.hbs"
    }
  });

  _exports.default = _default;
});
;define("aouda-ceams-frontend/templates/task-force-management", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "lMw/qeUV",
    "block": "{\"symbols\":[],\"statements\":[[1,[21,\"nav-bar\"],false],[0,\"\\n\"],[1,[21,\"task-force-management\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/task-force-management.hbs"
    }
  });

  _exports.default = _default;
});
;

;define('aouda-ceams-frontend/config/environment', [], function() {
  var prefix = 'aouda-ceams-frontend';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("aouda-ceams-frontend/app")["default"].create({"name":"aouda-ceams-frontend","version":"0.0.0+41a80363"});
          }
        
//# sourceMappingURL=aouda-ceams-frontend.map
