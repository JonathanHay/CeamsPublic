import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';
export default Component.extend({
  DS: service('store'),
  init() {

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
        numLogins: this.get('instructorLogins'),
        numGraded: this.get('instructorTestsGraded'),
        numCourses: this.get('instructorClassesTaught'),
        totalActions: this.get('instructorActions'),
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

        console.log(weights);

        var submission = {
          formulaType: "Instructor",
          formulaExpression: JSON.stringify(weights),
          formulaDescription: this.get('instructorMethodDescription') || "",
          staff: [],
          instructors: []
        }

        console.log(submission);

        let newUEM = this.DS.createRecord('user-evaluation-method', submission);
        newUEM.save().then(() => { alert('we did it') }, () => { alert('we failed') })

        $('#instructor-factors .error-message').hide();
      } else {
        $('#instructor-factors .error-message').show();
      }
    },
    submitStaffKPI(e) {
      let weights = {
        numLogins: this.get('staffLogins'),
        totalActions: this.get('staffActions'),
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

        var submission = {
          formulaType: "Staff",
          formulaExpression: JSON.stringify(weights),
          formulaDescription: this.get('staffMethodDescription') || "",
          staff: [],
          instructors: []
        }

        console.log(submission);

        let newUEM = this.DS.createRecord('user-evaluation-method', submission);
        newUEM.save().then(() => { alert('we did it') }, () => { alert('we failed') })




        $('#staff-factors .error-message').hide();
      } else {
        $('#staff-factors .error-message').show();
      }
    }
  }
});