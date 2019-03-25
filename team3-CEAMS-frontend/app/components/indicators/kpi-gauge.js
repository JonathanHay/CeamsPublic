import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';
export default Component.extend({
    DS: service('store'),
    init() {

        this._super(...arguments);

        $(document).ready(async () => {
            $('#staff-graph').hide();

            $('#instructor-button').click(function () {
                $('#staff-graph').hide();
                $('#instructor-graph').show();
                $(this).addClass('active');
                $('#staff-button').removeClass('active');
            });
            $('#staff-button').click(function () {
                $('#instructor-graph').hide();
                $('#staff-graph').show();
                $(this).addClass('active');
                $('#instructor-button').removeClass('active');
            });


            var ctx = $("#instructorPieChart");
            var instructorChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ["Logins", "Tests Graded", "Courses Taught", "Total Audit Trail Actions"],
                    datasets: [{
                        backgroundColor: [
                            "#2ecc71",
                            "#3498db",
                            "#DC143C",
                            "#9b59b6"
                        ],
                        data: [0, 0, 0, 0]
                    }],
                }
            });//chart

            var ctx2 = $("#staffPieChart");
            var staffChart = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ["Logins", "Total Audit Trail Actions"],
                    datasets: [{
                        backgroundColor: [
                            "#2ecc71",
                            "#3498db"
                        ],
                        data: [0, 0]
                    }],
                }
            });

            instructorChart.update();
            staffChart.update();

            this.set("instructorChart", instructorChart);
            this.set("staffChart", staffChart);


            let uem = await this.get('DS').findAll('user-evaluation-method');
            let instructorEvalMethods = [];
            let staffEvalMethods = [];
            let evalMethods;
            uem.forEach(function (obj) {
                if (obj.formulaType == "Instructor" || obj.formulaType == "instructor") {
                    evalMethods = instructorEvalMethods;
                } else if (obj.formulaType == "Staff" || obj.formulaType == "staff") {
                    evalMethods = staffEvalMethods;
                }
                evalMethods.push({
                    id: obj.id,
                    type: obj.formulaType,
                    description: obj.formulaDescription,
                    expression: obj.formulaExpression
                });
            })

            this.set('evalMethods', evalMethods);

            this.set('instructorEvalMethods', instructorEvalMethods);
            this.set('staffEvalMethods', staffEvalMethods);
            //chart

            // how to remove data
            // myChart.data.datasets[0].data.pop();

            // how to push data
            // myChart.data.labels.push("heyy");
            // myChart.data.datasets[0].data.push(23);
            // myChart.data.datasets[0].backgroundColor.push("#FF4500");


        }); //.ready
    }, //didRender

    actions: {
        populateInstructorChart(index) {
            let instructorEvalMethods = this.get('instructorEvalMethods');
            var formula = instructorEvalMethods[index].expression;
            formula = JSON.parse(formula);

            let instructorChart = this.get('instructorChart');

            instructorChart.data.datasets[0].data.pop();
            instructorChart.data.datasets[0].data.pop();
            instructorChart.data.datasets[0].data.pop();
            instructorChart.data.datasets[0].data.pop();

            instructorChart.data.datasets[0].data.push(formula.numLogins * 100);
            instructorChart.data.datasets[0].data.push(formula.numGraded * 100);
            instructorChart.data.datasets[0].data.push(formula.numCourses * 100);
            instructorChart.data.datasets[0].data.push(formula.totalActions * 100);

            instructorChart.update();
        },

        populateStaffChart(index) {
            let staffEvalMethods = this.get('staffEvalMethods');
            var formula = staffEvalMethods[index].expression;
            formula = JSON.parse(formula)

            let staffChart = this.get('staffChart');

            staffChart.data.datasets[0].data.pop();
            staffChart.data.datasets[0].data.pop();

            staffChart.data.datasets[0].data.push(formula.numLogins);
            staffChart.data.datasets[0].data.push(formula.totalActions);

            staffChart.update();
        }
    }
});

