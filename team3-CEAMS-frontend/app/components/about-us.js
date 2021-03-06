import Component from '@ember/component';
import $ from 'jquery';


export default Component.extend({

  tagName: '',

  didRender() {

    this._super(...arguments);


    $(document).ready(function() {
      // hide and open menu on small screen
      $('.ui.toggle.button').click(function() {
        $('.mobile.tablet.only.row .ui.vertical.menu').toggle("250", "linear")
      });

      // toggle right sidebar
      $('.ui.right.sidebar').sidebar({
        context: $('#ceams'),
        dimPage: false,
        closeable: false
      })
        .sidebar('setting', 'transition', 'push')
        .sidebar('attach events', '.ui.blue.button');

    });
  }
});
