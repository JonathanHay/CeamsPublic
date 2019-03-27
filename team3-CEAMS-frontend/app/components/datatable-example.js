import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({

  didRender(){
    this._super(...arguments);
    $('#example').DataTable();
  }

});
