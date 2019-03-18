import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    DS: service('store'),
    init() {
        this._super(...arguments);

        $(document).ready(async () => {
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


            let instructors = await this.get('DS').findAll('instructor');
            let staff = await this.get('DS').findAll('staff');
            let evaluationMethods = await this.get('DS').findAll('user-evaluation-method');

            let instructorsArray = [];
            let staffArray = [];

            let instructorEvaluationMethodsArray = [];
            let staffEvaluationMethodsArray = [];

            instructors.forEach(function (obj) {

                obj.username = obj.email.substr(0, obj.email.indexOf('@'))
                instructorsArray.push(obj);
            })

            staff.forEach(function (obj) {

                obj.username = obj.email.substr(0, obj.email.indexOf('@'))
                staffArray.push(obj);
            })

            evaluationMethods.forEach(function (obj) {
                if (obj.formulaType == "Instructor" || obj.forumlaType == "instructor") {
                    instructorEvaluationMethodsArray.push(obj);
                } else if (obj.formulaType == "Staff" || obj.forumlaType == "staff") {
                    staffEvaluationMethodsArray.push(obj);
                }
            })




            instructorsArray.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
            staffArray.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);

            instructorEvaluationMethodsArray.sort((a, b) => (a.formulaDescription > b.formulaDescription) ? 1 : -1);
            staffEvaluationMethodsArray.sort((a, b) => (a.formulaDescription > b.formulaDescription) ? 1 : -1);

            this.set('instructors', instructorsArray);
            this.set('staff', staffArray);
            this.set('instructorMethods', instructorEvaluationMethodsArray);
            this.set('staffMethods', staffEvaluationMethodsArray);

        });
    },
    actions: {
        setInstructor(index) {
            this.set('instructorIndex', index);
            console.log(index);
        },
        setInstructorMethod(index) {
            this.set('instructorMethodIndex', index);
            console.log(index);
        },
        async assignInstructorMethod() {
            //get instructor from index
            var chosenInstructor = this.get('instructors')[parseInt(this.get('instructorIndex'))];
            console.log("chosen instructor: " + chosenInstructor.firstName);
            //get method from index
            var chosenMethod = this.get('instructorMethods')[parseInt(this.get('instructorMethodIndex'))];
            console.log((await chosenMethod.get('instructors')).toArray());
            console.log("chosen method: " + chosenMethod.id);

            //set instructor evaluationMethod to new method
            chosenInstructor.set('evaluationMethod', chosenMethod);

            //send put request for instructor
            chosenInstructor.save();

        },
        setStaff(index) {
            this.set('staffIndex', index);
            console.log(index);
        },
        setStaffMethod(index) {
            this.set('staffMethodIndex', index);
            console.log(index);
        },
        async assignStaffMethod() {
            //get staff from index
            var chosenStaff = this.get('staff')[parseInt(this.get('staffIndex'))];
            console.log("chosen staff: " + chosenStaff.firstName);
            //get method from index
            var chosenMethod = this.get('staffMethods')[parseInt(this.get('staffMethodIndex'))];
            console.log((await chosenMethod.get('staff')).toArray());
            console.log("chosen method: " + chosenMethod.id);

            //set staff evaluationMethod to new method
            chosenStaff.set('evaluationMethod', chosenMethod);

            //send put request for instructor
            chosenStaff.save();

        }
    }
});
