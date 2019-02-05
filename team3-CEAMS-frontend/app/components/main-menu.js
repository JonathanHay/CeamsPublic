import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({


  didRender() {

    this._super(...arguments);

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
  }

  });



