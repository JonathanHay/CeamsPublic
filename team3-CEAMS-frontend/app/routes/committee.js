import Route from '@ember/routing/route';

export default Route.extend({
  model: function(){
    return this.store.query('member-attending-meeting', {
      filter: {
        memberRole: 'UNIQUE-ADMIN'
      }
    });
  }
});
