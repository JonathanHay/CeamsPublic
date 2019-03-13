import Component from '@ember/component';
import $ from 'jquery';
export default Component.extend({
    didRender() {

        this._super(...arguments);
    
        $(document).ready(function() {

            var ctx = $("#pieChart");
            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: ["Number of logins", "Number of tests graded", "Number of courses taught", "Total audit trail actions"],
                  datasets: [{
                    backgroundColor: [
                      "#2ecc71",
                      "#3498db",
                      "#95a5a6",
                      "#9b59b6"
                    ],
                    data: [12, 19, 3, 17]
                  }],
                }
              });//chart
              var ctx = $("#pieChart2");
              var myChart2 = new Chart(ctx, {
                  type: 'pie',
                  data: {
                    labels: ["Number of logins", "Total audit trail actions"],
                    datasets: [{
                      backgroundColor: [
                        "#2ecc71",
                        "#3498db",
                      ],
                      data: [3, 17]
                    }],
                  }
                });//chart

        }); //.ready
      } //didRender
});
