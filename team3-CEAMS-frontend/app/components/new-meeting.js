import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    DS: service('store'),

    actions:{
        create: function(){
            let startDate = this.get('startDate').split('-');
            let startTime= this.get('startTime').split(':');
            let month = parseInt(startDate[1]);
            if(month==0){
                month=11;
            }else{
                month-=1;
            }
            startDate[1] = month.toString();
            let finalStartDate = new Date(startDate[0], startDate[1], startDate[2], startTime[0], startTime[1]); 

            let endDate = this.get('endDate').split('-');
            let endTime= this.get('endTime').split(':');
            let endMonth = parseInt(endDate[1]);
            if(endMonth==0){
                endMonth=11;
            }else{
                endMonth-=1;
            }
            endDate[1] = endMonth.toString();
            let finalEndDate = new Date(endDate[0], endDate[1], endDate[2], endTime[0], endTime[1]); 

            var newMeeting = this.get('DS').createRecord('meeting', {
                location: this.get('location'),
                description: this.get('description'),
                minutes: this.get('minutes'),
                startDateTime: finalStartDate,
                endDateTime: finalEndDate
            });

            newMeeting.save().then(() => {
                window.alert('Meeting Created')
            },(err)=>{
                window.alert('Error, please try again')
            });
        },
        closeModal: function () {
            $('.ui.newMeeting.modal').modal('hide');
        },
        openModal: function () {
            this.set('location', null);
            this.set('description', null);
            this.set('startDate', null);
            this.set('startTime', null);
            this.set('endTime', null);
            this.set('endDate', null);
            
            $('.ui.newMeeting.modal').modal({
              closable: false,
      
              onDeny: () => {
                return true;
              },
      
              onApprove: () => {
                }
            })
            .modal('show');
        },
    }
});