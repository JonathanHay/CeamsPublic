import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('main-menu');
  this.route('home-page', { path: '/' });
  this.route('login');
  this.route('team-detail', { path: '/:committee_id' });
  this.route('meeting');
  this.route('committee');
  this.route('new-task-force');
  this.route('committees', function () {
    this.route('new');
<<<<<<< HEAD
    this.route('detail', { path: '/detail/:committee_id' });
    this.route('manage-users', { path: '/manage-users/:committee_id' });
=======
    this.route('detail');
    this.route('manage-users');
    this.route('team-detail', { path: '/:committee_id' });
>>>>>>> jhay22
  });
  this.route('indicators', function () {
    this.route('manage-upi');
    this.route('manage-kpi');
    this.route('kpi-gauge');
  });
});

export default Router;
