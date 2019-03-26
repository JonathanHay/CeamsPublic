import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  DS: service('store'),

  actions: {
    export: function () {

      var pdfDocument = {
        content: [
          {
            text: 'List of Courses\n\n', style: 'header'
          },
          {
            table: {
              widths: [80, 300, 80],
              headerRows: 1,
              body: [
                [{text: 'Course Code', style: 'tableHeader'},
                  {text: 'Course Name', style: 'tableHeader'},
                  {text: 'Academic Credit', style: 'tableHeader'}]
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
      this.get('courses').forEach((course) => {
        let cel1 = course.number || "";
        let cel2 = course.title || "";
        let cel3 = course.academicCredit || "";
        let row = [cel1, cel2, cel3];

        pdfDocument.content[1].table.body.push(row);

      });

      pdfMake.createPdf(pdfDocument).download();

    }
  }
});
