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
            this.get('kpiList').forEach((one) => {
                if (one.error == undefined) {
                    let c1 = one.username || "";
                    let c2 = one.rawData.numLogins || "0";
                    let c3 = one.rawData.totalActions || "0";
                    let c4 = one.rawData.numGraded || "0";
                    let c5 = one.rawData.numCourses || "0";
                    let c6 = one.score || "0";
                    let row = [c1, c2, c3, c4, c5, c6];

                    pdfDocument.content[1].table.body.push(row);
                }
            });

            pdfMake.createPdf(pdfDocument).download();

        }
    }
});
