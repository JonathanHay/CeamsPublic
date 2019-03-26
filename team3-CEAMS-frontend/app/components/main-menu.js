import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  routing: service('router'),

  FEAT07_000IsPermitted: computed(function () {
    let authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT07_000") >= 0);
    }
  }),

  FEAT28_000IsPermitted: computed(function(){ //Admin Portal functionality
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_000") >= 0);
    }
  }),

  didRender() {

    this._super(...arguments);

    $('.admin.dropdown')
      .dropdown({
      })
    ;

    $(document).ready(function() {
      // hide and open menu on small screen
      $('.ui.toggle.button').click(function() {
        $('.mobile.tablet.only.row .ui.vertical.menu').toggle("250", "linear")
      });

      // toggle right sidebar
      $('.ui.right.sidebar').sidebar({
        context: $('.pusher.segment'),
        dimPage: false,
        closeable: false
      })
        .sidebar('setting', 'transition', 'push')
        .sidebar('attach events', '.ui.blue.button');

      // toggle left sidebar
      $('.ui.left.sidebar').sidebar({
        context: $('body')
      })
        .sidebar('setting', 'transition', 'scale down')
        .sidebar('attach events', '.ui.green.button');
    });
  },


  // renderTemplate: function () {
  //
  //   if (this.get('oudaAuth').get('isAuthenticated')) { //This is to disable the effect of back button in the browser
  //     //     location.replace(location.origin+'/home');
  //     this.get('oudaAuth').set('isLoginRequested', false);
  //     this.get('oudaAuth').close();
  //     this.render('main-menu', {  // the template to render
  //     });
  //   }else {
  //     this.get('oudaAuth').set('isLoginRequested', true);
  //     this.render('login', {  // the template to render
  //       //   into: 'home-page' ,  // the template to render into
  //       //  outlet: 'login'
  //     });
  //   }
  // }


  });



