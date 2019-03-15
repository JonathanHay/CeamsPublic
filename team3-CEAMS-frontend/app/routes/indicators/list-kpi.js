import Route from '@ember/routing/route';

export default Route.extend({
    async model() {
        var temp1 = await this.store.findAll("user-account");
        var temp2 = await this.store.findAll("kpi-report");
        temp1 = temp1.toArray();
        temp2 = temp2.toArray()
        console.log(temp1);
        console.log(temp2);
        var models = { users: temp1, kpiReports: temp2 };
        console.log(models);
        return models;
    }
});
