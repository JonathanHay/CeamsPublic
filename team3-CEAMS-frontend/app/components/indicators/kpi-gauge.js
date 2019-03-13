import Component from '@ember/component';
import $ from 'jquery';
export default Component.extend({
  didRender() {

    this._super(...arguments);

    $(document).ready(function () {

      var ctx = $("#pieChart");
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ["Kpi #1", "Kpi #2", "Kpi #3", "Kpi #4"],
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

      // how to remove data
      // myChart.data.datasets[0].data.pop();

      // how to push data
      // myChart.data.labels.push("heyy");
      // myChart.data.datasets[0].data.push(23);
      // myChart.data.datasets[0].backgroundColor.push("#FF4500");

      myChart.update();
    }); //.ready
  }, //didRender

  actions: {
    populateInstructor(values){
      
    }
  }
});
