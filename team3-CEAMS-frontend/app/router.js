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
  this.route('team-detail');
  this.route('meetings');
});

export default Router;
