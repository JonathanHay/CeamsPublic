import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    DS: service('store'),
    actions: {
        openModal: function () {
            $('.ui.newModal.modal').modal({
                closable: false,
                onDeny: () => {
                    return true;
                },
                onApprove: () => {

                }
            })
                .modal('show');
        },
        closeModal: function () {
            $('.ui.newModal.modal').modal({
                closable: false,
                onDeny: () => {
                    return true;
                },
                onApprove: () => {

                }
            })
                .modal('hide');
        },
        createCommittee: function () {
            console.log("Saving Committee...")
            var newCommittee = this.get('DS').createRecord('committee', {
                name: this.get('title'),
                level: this.get('level')
            });
            newCommittee.save().then(() => {
                console.log("Committee Saved");
                return true;
            });
            $('.ui.newModal.modal').modal({
                closable: false,
                onDeny: () => {
                    return true;
                },
                onApprove: () => {

                }
            })
                .modal('hide');
        }
    }
});
