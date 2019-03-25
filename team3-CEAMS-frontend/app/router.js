import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home-page');
  this.route('login');
  this.route('datatable-example');
  this.route('ceams', function() {
    this.route('about');
    this.route('manage-user-accounts');
    this.route('manage-roles');
    this.route('manage-capabilities');
    this.route('courses');
  });

  this.route('seams', function() {});
});

export default Router;
