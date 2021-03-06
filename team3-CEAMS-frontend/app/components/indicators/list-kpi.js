import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.set('errors', []);
        this.set("query", "");
        this.set("selectedUsers", []);
    },
    didUpdateAttrs() {
        this._super(...arguments);
        this.set('errors', []);
        var temp = this.get("users");
        var theQuery = this.get("query");
        if (this.get("query") != "") {
            temp = temp.filter(function (item) { return (item.userName.includes(theQuery)) });
        }
        this.set("allUsers", temp);
    },
    DS: service('store'),
    allUsers: computed('users', 'query', function () {
        var temp = this.get("users");
        var theQuery = this.get("query");
        if (this.get("query") != "") {
            temp = temp.filter(function (item) { return (item.userName.includes(theQuery)) });
        }
        return temp;
    }),
    errorlessList: computed(function () {
        var result = [];
        this.get('kpiList').forEach((one) => {
            if (one.error == null) {
                let c1 = one.userName || "";
                let c2 = one.rawData;
                let c3 = one.score || "0";
                let c4 = one.id;
                let c5 = one.formula;
                if (c5.numLogins == undefined) {
                    c5.numLogins = 0;
                }
                if (c5.numGraded == undefined) {
                    c5.numGraded = 0;
                }
                if (c5.numCourses == undefined) {
                    c5.numCourses = 0;
                }
                if (c5.totalActions == undefined) {
                    c5.totalActions = 0;
                }
                let row = { c1, c2, c3, c4, c5 };
                result.push(row);
            }
        });
        return result;
    }),
    actions: {
        export: function () {
            var pdfDocument = {
                content: [
                    {
                        text: 'List of KPI Reports\n\n', style: 'header'
                    },
                    {
                        text: 'Instructors:\n\n', style: 'header',
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
                    },
                    {
                        text: 'Staff:\n\n', style: 'header',
                    },
                    {
                        table: {
                            widths: ['auto', 'auto', 'auto', 'auto'],
                            headerRows: 1,
                            body: [
                                [{ text: 'Username', style: 'tableHeader' },
                                { text: '# of Logins', style: 'tableHeader' },
                                { text: '# of Audit Trail Entries', style: 'tableHeader' },
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
                var report = this.get('errorlessList').findBy("c4", one.id);
                if (report != undefined) {
                    exportables.push(report);
                } else {
                    issue = true;
                }
            });
            var hasStaff = false;
            var hasInstructors = false;
            if (exportables.length > 0) {
                exportables.forEach((one) => {
                    var temp = [];
                    if (Object.keys(one.c2).length == 4) {
                        hasInstructors = true;
                        temp = [one.c1, one.c2.numLogins + " (" + one.c5.numLogins + "%)", one.c2.totalActions + " (" + one.c5.totalActions + "%)", one.c2.numGraded + " (" + one.c5.numGraded + "%)", one.c2.numCourses + " (" + one.c5.numCourses + "%)", one.c3];
                        pdfDocument.content[2].table.body.push(temp);
                    } else {
                        hasStaff = true;
                        temp = [one.c1, one.c2.numLogins + " (" + one.c5.numLogins + "%)", one.c2.totalActions + " (" + one.c5.totalActions + "%)", one.c3,];
                        pdfDocument.content[4].table.body.push(temp);
                    }

                });
                if (!hasStaff) {
                    pdfDocument.content[3] = {};
                    pdfDocument.content[4] = {};
                } else if (!hasInstructors) {
                    pdfDocument.content[1] = {};
                    pdfDocument.content[2] = {};
                }
                else if (hasInstructors && hasStaff) {
                    pdfDocument.content[3] = { text: '\nStaff:\n\n', style: 'header' };
                }
                pdfMake.createPdf(pdfDocument).download();
                if (issue) {
                    issue = false;
                    alert("ATTENTION!\nSome KPI Report records contained errors and may not appear in the generated table.\nPlease contact your database administrator");
                }
            } else {
                if (issue) {
                    issue = false;
                    alert("ATTENTION!\nSome KPI Report records contained errors and may not appear in the generated table.\nPlease contact your database administrator");
                } else {
                    alert("ATTENTION!\nNo users have been selected to generate reports");
                }
            }

        },
        exportAll: function () {
            var pdfDocument = {
                content: [
                    {
                        text: 'List of KPI Reports\n\n', style: 'header'
                    },
                    {
                        text: 'Instructors:\n\n', style: 'header',
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
                    },
                    {
                        text: 'Staff:\n\n', style: 'header',
                    },
                    {
                        table: {
                            widths: ['auto', 'auto', 'auto', 'auto'],
                            headerRows: 1,
                            body: [
                                [{ text: 'Username', style: 'tableHeader' },
                                { text: '# of Logins', style: 'tableHeader' },
                                { text: '# of Audit Trail Entries', style: 'tableHeader' },
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
            this.get('allUsers').forEach((one) => {
                var report = this.get('errorlessList').findBy("c4", one.id);
                if (report != undefined) {
                    exportables.push(report);
                } else {
                    issue = true;
                }
            });
            var hasStaff = false;
            var hasInstructors = false;
            if (exportables.length > 0) {
                exportables.forEach((one) => {
                    var temp = [];
                    if (Object.keys(one.c2).length == 4) {
                        hasInstructors = true;
                        temp = [one.c1, one.c2.numLogins + " (" + one.c5.numLogins + "%)", one.c2.totalActions + " (" + one.c5.totalActions + "%)", one.c2.numGraded + " (" + one.c5.numGraded + "%)", one.c2.numCourses + " (" + one.c5.numCourses + "%)", one.c3];
                        pdfDocument.content[2].table.body.push(temp);
                    } else {
                        hasStaff = true;
                        temp = [one.c1, one.c2.numLogins + " (" + one.c5.numLogins + "%)", one.c2.totalActions + " (" + one.c5.totalActions + "%)", one.c3,];
                        pdfDocument.content[4].table.body.push(temp);
                    }

                });
                if (!hasStaff) {
                    pdfDocument.content[3] = {};
                    pdfDocument.content[4] = {};
                } else if (!hasInstructors) {
                    pdfDocument.content[1] = {};
                    pdfDocument.content[2] = {};
                }
                else if (hasInstructors && hasStaff) {
                    pdfDocument.content[3] = { text: '\nStaff:\n\n', style: 'header' };
                }
                pdfMake.createPdf(pdfDocument).download();
                if (issue) {
                    issue = false;
                    alert("ATTENTION!\nSome KPI Report records contained errors and may not appear in the generated table.\nPlease contact your database administrator");
                }
            } else {
                if (issue) {
                    issue = false;
                    alert("ATTENTION!\nSome KPI Report records contained errors and may not appear in the generated table.\nPlease contact your database administrator");
                } else {
                    alert("ATTENTION!\nNo users have been selected to generate reports");
                }
            }
        },
        add: function (user) {
            if (this.get("selectedUsers").isAny('id', user.id)) {
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
                temp = temp.filter(function (item) { return (item.userName.includes(theQuery)) });
            }
            this.set("allUsers", temp);
        }
    }
});
