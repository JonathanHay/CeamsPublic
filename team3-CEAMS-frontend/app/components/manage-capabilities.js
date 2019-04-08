import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';
//
// This controller is responsible to assign system capabilities
// (i.e., system functionality) to the pre-defined system roles
//

export default Component.extend({
  isDataImporting: false,
  store: service(),
  flag: false,
  data: null,
  table : null,
  redraw: false,

  didInsertElement(){
    this._super(...arguments);

    if (this.get('table')) {
      this.get('table').draw();
    } else {
      this.set('table',  $('#features').DataTable( {
        paging: true,
        "columnDefs": [
          { "orderable": false, "targets": 2 }
        ]
      }));
    }
  },
  //
  // capabilityModel: computed('redraw', function () {
  //   return this.get('store').findAll('capability');
  // }),

  FEAT28_006IsPermitted: computed(function () { // Manage System Features/Privilege
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("FEAT28_006") >= 0);
    }
  }),

  actions: {
    import: function(){
      this.set('isDataImporting', true);
    }
  }
});
