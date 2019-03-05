import Component from '@ember/component';
import $ from 'jquery';
export default Component.extend({
    didRender() {

        this._super(...arguments);
    
        $(document).ready(function() {
          $('#edit-button').click(function() {
            $('.weight').prop('readonly',false);
          });
          $('#save-button').click(function() {
            $('.weight').prop('readonly',true);
          });
        });
      }
});
