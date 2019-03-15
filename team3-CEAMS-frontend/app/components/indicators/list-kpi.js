import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('errors', []);
        this.set("query", "");
        this.set("selectedUsers", []);
        console.log("fuck");
    },
    didUpdateAttrs() {
        this._super(...arguments);
        this.set('errors', []);
        var temp = this.get("users");
        var theQuery = this.get("query");
        console.log("Query: " + theQuery);
        if (this.get("query") != "") {
            temp = temp.filter(function (item) { return (item.username.includes(theQuery)) });
        }
        this.set("allUsers", temp);
    },
    DS: service('store'),
    allUsers: computed(function () {
        var temp = this.get("users");
        var theQuery = this.get("query");
        console.log("Query: " + theQuery);
        if (this.get("query") != "") {
            temp = temp.filter(function (item) { return (item.username.includes(theQuery)) });
        }
        return temp;
    }),
    errorlessList: computed(function () {
        var result = [];
        this.get('kpiList').forEach((one) => {
            if (one.error == undefined) {
                let c1 = one.username || "";
                let c2 = one.rawData.numLogins || "0";
                let c3 = one.rawData.totalActions || "0";
                let c4 = one.rawData.numGraded || "0";
                let c5 = one.rawData.numCourses || "0";
                let c6 = one.score || "0";
                let c7 = one._id;
                console.log(c7)
                let row = { c1, c2, c3, c4, c5, c6, c7 };
                result.push(row);
            }
        });
        return result;
    }),
    actions: {
        exportAll: function () {
            var pdfDocument = {
                content: [
                    {
                        text: 'List of KPI Reports\n\n', style: 'header'
                    },
                    {
                        table: {
                            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            headerRows: 1,
                            body: [
                                [{ text: 'Username', style: 'tableHeader' },
                                { text: '# of Logins', style: 'tableHeader' },
                                { text: '# of Audit Trail Entries', style: 'tableHeader' },
                                { text: '# of Tests Graded', style: 'tableHeader' },
                                { text: '# of Classes Taught', style: 'tableHeader' },
                                { text: 'Score', style: 'tableHeader' }]
                            ]
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 14,
                        bold: true
                    },
                    tableHeader: {
                        bold: true
                    }
                }
            };

            // fill the document data
            var exportables = [];
            var issue = false;
            this.get('selectedUsers').forEach((one) => {
                var report = this.get('errorlessList').findBy("c7", one._id);
                if (report != undefined) {
                    exportables.push(report);
                } else {
                    issue = true;
                }
            });
            if (exportables.length > 0) {
                exportables.forEach((one) => {
                    var temp = [one.c1, one.c2, one.c3, one.c4, one.c5, one.c6];
                    pdfDocument.content[1].table.body.push(temp);
                });
                pdfMake.createPdf(pdfDocument).download();
                if (issue) {
                    issue = false;
                    alert("ATTENTION!\nSome KPI Report records contained errors and may not appear in the generated table. \n Please contact your database administrator");
                }
            } else {
                alert("ATTENTION!\nNo users have been selected to generate reports");
            }

        },
        add: function (user) {
            if (this.get("selectedUsers").isAny('_id', user._id)) {
                console.log("alreadyAdded!");
            } else {
                this.get("selectedUsers").pushObject(user);
            }

        },
        remove: function (user) {
            this.get("selectedUsers").removeObject(user);

        },
        search: function () {
            var temp = this.get("users");
            var theQuery = this.get("query");
            if (this.get("query") != "") {
                temp = temp.filter(function (item) { return (item.username.includes(theQuery)) });
            }
            this.set("allUsers", temp);
        }
    }
});
