import Component from '@ember/component';
import {inject as service} from '@ember/service';
import FileSaver from 'file-saver';
import {computed} from '@ember/object';


export default Component.extend({
  DS: service('store'),

  FEAT07_002IsPermitted: computed(function(){ //Delete course
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT07_002") >= 0);
    }
  }),

  actions: {
    export: function () {

      // create a workbook
      let workbook = new ExcelJS.Workbook();

      //Set Workbook Properties
      workbook.creator = 'AK Ouda';
      workbook.lastModifiedBy = 'SE3350B';
      workbook.created = new Date(2019, 3, 7);
      workbook.modified = new Date();

      // create a sheet
      let worksheet = workbook.addWorksheet('Courses');

      // Add column headers and define column keys and widths
      worksheet.columns = [
        { header: 'Course Code', key: 'number', width: 12 },
        { header: 'Course Name', key: 'title', width: 60 },
        { header: 'Academic Credit', key: 'academicCredit', width: 15 }
      ];

      worksheet.getRow(1).font = {
        bold: true
      };
      // Set a specific row height
      worksheet.getRow(1).height = 42.5;
      // Set a specific row alignment
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      // Set a specific cell fill style
      worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'}
      };
      worksheet.getCell('B1').fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'}
      };
      worksheet.getCell('C1').fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'}
      };

      // set single thin border
      worksheet.getCell('A1').border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      worksheet.getCell('B1').border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      worksheet.getCell('C1').border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };

      // Add some Rows by key-value, after the last current row, using the column keys
      this.get('courses').forEach((course)=>{
        worksheet.addRow({number: course.number, title: course.title, academicCredit: course.academicCredit});
      });

      // Save the workbook into one excel file
      workbook.xlsx.writeBuffer()
        .then(buffer =>
          FileSaver.saveAs(
            new Blob([buffer]), 'courses.xlsx')
        )
        .catch(err => console.log('Error writing excel export', err))
    }
  }
});
