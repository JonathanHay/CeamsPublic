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
                    _id: "asghfddsf",
                    name: "Yeet"
                }
            ]
        };
    }
});
