import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';


export default Component.extend({

  store: service(),
  tableHeader: [],
  tableData: null,
  isLoading: false,
  flag: false,
  table : null,

  FEAT28_011IsPermitted: computed(function () {
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_011") >= 0);
    }
  }),


  willRender(){
    this._super(...arguments);

    if (this.get('table')) {
 //     this.get('table').draw();
    } else {
      this.set('table',  $('#ExcelData').DataTable({
          "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    }
      ));
    }


  },


  actions: {
    fileImported: function (file) {
      this.set('isLoading', true);

      // create a workbook
      let workbook = new ExcelJS.Workbook();

      var col = null;
      var data = [];
      var header = [];

      let self = this;
      // load from buffer
      workbook.xlsx.load(file.data)
        .then(function() {

          /* Get worksheet */
          var worksheet = workbook.getWorksheet(1);
          //  var first_sheet_name = workbook.SheetNames[0];

          // Iterate over all rows (including empty rows) in a worksheet
          worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            if (rowNumber === 1) {
              header = row.values.slice(1);
            } else {
              data[rowNumber]=  row.values.slice(1);
            }

          });
          self.set('tableHeader', header);
          self.set('tableData', data);
        });
   },

    save: function () {
      var myStore = this.get('store');
      let features = myStore.peekAll('capability');

      let oldFeatures = [];
      features.forEach((feat)=>{
        oldFeatures.push(feat.code);
      });


      let featuresToSave = [];

      if (features.length === 0 ) {
        featuresToSave = this.get('tableData');
      } else {
        featuresToSave = this.get('tableData').filter(function(obj) {
          return oldFeatures.indexOf(obj[0]) == -1;
        });
      }


      // save new data
        featuresToSave.forEach(function (row) {
          console.log(row[0],row[1]);
          var newFeature = myStore.createRecord('capability', {
            code: row[0],
            systemFeature: row[1]
          });
          newFeature.save();
        });

      this.set('flag', false); // this makes isDataImporting to be false
    },

    cancel: function () {
      this.set('flag', false); // this makes isDataImporting to be false
    }

  }
});



