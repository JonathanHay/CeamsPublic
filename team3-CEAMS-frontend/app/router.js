import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('main-menu');
  this.route('home-page', {path: '/'});
  this.route('login');
  this.route('committees', function() {
    this.route('detail', { path: '/team/:id' });
    this.route('manage-users');
  });
});

export default Router;
