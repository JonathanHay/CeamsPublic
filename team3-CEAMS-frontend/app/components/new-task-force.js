import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('title', '');
        this.set('level', '');
    },
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
            $('#nerr').removeClass('hidden');
            $('#lerr').removeClass('hidden');
            $('#nerr').addClass('hidden');
            $('#lerr').addClass('hidden');
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
            $('#nerr').removeClass('hidden');
            $('#lerr').removeClass('hidden');
            $('#nerr').addClass('hidden');
            $('#lerr').addClass('hidden');
            if (this.get('title') == '' || this.get('level') == '') {
                if (this.get('title') == '') {
                    $('#nerr').removeClass('hidden');
                }
                if (this.get('level') == '') {
                    $('#lerr').removeClass('hidden');
                }
            } else {
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
    }
});
