define("aouda-ceams-frontend/components/main-menu", ["exports"], function (_exports) {
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
    },

    renderTemplate: function () {
      if (this.get('oudaAuth').get('isAuthenticated')) {
        //This is to disable the effect of back button in the browser
        //     location.replace(location.origin+'/home');
        this.get('oudaAuth').set('isLoginRequested', false);
        this.get('oudaAuth').close();
        this.render('main-menu', {// the template to render
          //   into: 'main-menu' ,  // the template to render into
          //      outlet: 'login'
        });
      } else {
        this.get('oudaAuth').set('isLoginRequested', true);
        this.render('login', {// the template to render
          //   into: 'home-page' ,  // the template to render into
          //  outlet: 'login'
        });
      }
    }
  });

  _exports.default = _default;
});