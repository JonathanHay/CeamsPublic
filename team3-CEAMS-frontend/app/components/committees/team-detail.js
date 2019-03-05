import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
    actions: {
        openModal: function () {
            $('.ui.teamDetail.modal').modal({
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
            $('.ui.teamDetail.modal').modal({
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
