import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return {
            allCommittees: [
                {
                    _id: "wiofvnewoi",
                    name: "Task Force 1"
                },
                {
                    _id: "asghfddfsf",
                    name: "Task Force 2"
                }, {
                    _id: "tgdfgdgfdfg",
                    name: "Task Force 3"
                }
            ]
        };
    }
});
