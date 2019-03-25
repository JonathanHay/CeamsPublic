import Route from '@ember/routing/route';

export default Route.extend({
  renderTemplate: function () {

    if (this.get('oudaAuth').get('isAuthenticated')) { //This is to disable the effect of back button in the browser
      //     location.replace(location.origin+'/home');
      this.get('oudaAuth').set('isLoginRequested', false);
      this.get('oudaAuth').close();
      this.render('home-page', {  // the template to render
        into: 'application' ,  // the template to render into
        //      outlet: 'login'
      });
    }else {
      this.get('oudaAuth').set('isLoginRequested', true);
      this.render('login', {  // the template to render
   //     into: 'ceams' ,  // the template to render into
   //     outlet: 'login'
      });
    }
  }

});
