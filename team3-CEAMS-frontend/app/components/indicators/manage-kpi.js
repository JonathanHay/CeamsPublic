import Component from '@ember/component';
import $ from 'jquery';
export default Component.extend({
  didRender() {

    this._super(...arguments);

    $(document).ready(function () {
      $('#staff-factors').hide();

      $('#instructor-button').click(function () {
        $('#staff-factors').hide();
        $('#instructor-factors').show();
        $(this).addClass('active');
        $('#staff-button').removeClass('active');
      });
      $('#staff-button').click(function () {
        $('#instructor-factors').hide();
        $('#staff-factors').show();
        $(this).addClass('active');
        $('#instructor-button').removeClass('active');
      });
    });
  }
});
