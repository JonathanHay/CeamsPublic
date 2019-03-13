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
  },
  actions: {
    submitInstructorKPI(e) {
      e.preventDefault();
      let weights = {
        logins: this.get('instructorLogins'),
        testsGraded: this.get('instructorTestsGraded'),
        classesTaught: this.get('instructorClassesTaught'),
        actions: this.get('instructorActions'),
      };
      
      let sum = 0;
      for (const key in weights) {
        if (weights.hasOwnProperty(key)) {
          const w = weights[key];
          if (w === undefined) sum += 0;
          else sum += parseInt(w);
        }
      }

      if (sum == 100) {
        console.log('submit');
        $('#instructor-factors .error-message').hide();
      } else {
        $('#instructor-factors .error-message').show();
      }
    }
  }
});