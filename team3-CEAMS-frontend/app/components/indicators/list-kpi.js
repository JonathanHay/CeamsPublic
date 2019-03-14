import Component from '@ember/component';

import { inject as service } from '@ember/service';

export default Component.extend({
    DS: service('store'),
    actions: {
        exportAll: function () {
            var pdfDocument = {
                content: [
                    {
                        text: 'List of KPI Reports\n\n', style: 'header'
                    },
                    {
                        table: {
                            widths: [80, 300, 80],
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
            this.get('kpiList').forEach((one) => {
                let c1 = one.username || "";
                let c2 = one.rawData.numLogins || "";
                let c3 = course.rawData.totalActions || "";
                let c4 = course.rawData.numGraded || "";
                let c5 = course.rawData.numCourses || "";
                let c6 = course.score || "";
                let row = [c1, c2, c3, c4, c5, c6];

                pdfDocument.content[1].table.body.push(row);

            });

            pdfMake.createPdf(pdfDocument).download();

        }
    }
});
