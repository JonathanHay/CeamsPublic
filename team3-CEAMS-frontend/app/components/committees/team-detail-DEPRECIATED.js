export default Component.extend({
    init() {
        this._super(...arguments);
    },
    router: service(),
    store: service(),
    members: computed(async function () {
        var temp
        var oneMember
        temp = (await this.get('store').query('committee-membership', {
            filter: {
                committee: this.get('_id')
            }
        })).toArray();
        for (var i = 0; i < temp.length; i++) {
            if ((await temp[i].instructorMember) != null) {
                oneMember = (await temp[i].instructorMember)
                temp[i].name = oneMember.firstName + " " + oneMember.lastName;
            } else if ((await temp[i].staffMember) != null) {
                oneMember = (await temp[i].staffMember)
                temp[i].name = oneMember.firstName + " " + oneMember.lastName;
            } else if ((await temp[i].teachingAssistantMember) != null) {
                oneMember = (await temp[i].teachingAssistantMember);
                temp[i].name = oneMember.firstName + " " + oneMember.lastName;
            } else {
                temp[i].name = "ERROR!";
            }
        }
        return temp;
    }),
    detailName: computed(function () {
        return 'detail' + this.get('_id');
    }),
    actions: {
        openModal: function () {
            $('.ui.' + this.get('detailName') + '.modal').modal({
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
            $('.ui.' + this.get('detailName') + '.modal').modal({
                closable: false,
                onDeny: () => {
                    return true;
                },
                onApprove: () => {

                }
            })
                .modal('hide');
        },
        manageUsers: function () {
            $('.ui.' + this.get('detailName') + '.modal').modal({
                closable: false,
                onDeny: () => {
                    return true;
                },
                onApprove: () => {

                }
            })
                .modal('hide');
            this.get('router').transitionTo('committees.manage-users');
        }
    }
});
