import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('title', '');
    },
    DS: service('store'),
    modalName: computed(function () {
        return 'delMeeting' + this.get('delID');
    }),
    actions: {
        openModal: function () {
            $('.ui.' + this.get('modalName') + '.modal').modal({
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
            $('#nerr2').removeClass('hidden');
            $('#nerr2').addClass('hidden');
            $('.ui.' + this.get('modalName') + '.modal').modal({
                closable: false,
                onDeny: () => {
                    return true;
                },
                onApprove: () => {

                }
            })
                .modal('hide');
        },
        delCommittee: function () {
            $('#nerr2').removeClass('hidden');
            $('#nerr2').addClass('hidden');
            if (this.get('title') != this.get('correctTitle')) {
                alert("Incorrect Title");
                $('#nerr2').removeClass('hidden');
            } else {
                this.get('DS').find('committee', this.get("delID")).then(function (post) {
                    post.destroyRecord(); // => DELETE to /posts/2
                });
                $('.ui.' + this.get('modalName') + '.modal').modal({
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
