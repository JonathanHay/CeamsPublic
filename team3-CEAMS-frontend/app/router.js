import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('home-page', { path: '/' });
  this.route('login');
  this.route('datatable-example');
  this.route('ceams', function () {
    this.route('about');
    this.route('manage-user-accounts');
    this.route('manage-roles');
    this.route('manage-capabilities');
    this.route('courses');

    this.route('indicators', function () {
      this.route('list-kpi');
      this.route('assign-evaluation-methods');
    });
    this.route('new-task-force');
    this.route('team-detail', { path: '/:committee_id' });
    this.route('meeting');
    this.route('manage-upi');
    this.route('manage-kpi');
    this.route('ga-task-force');
    this.route('delete-task-force');
    this.route('committees', function () {
      this.route('detail', { path: '/detail/:committee_id' });
      this.route('manage-users', { path: '/manage-users/:committee_id' });
    });
    this.route('indicators', function () {
      this.route('list-kpi');
      this.route('manage-upi');
      this.route('kpi-gauge');
      this.route('manage-kpi');
      this.route('assign-evaluation-methods');
    });

    this.route('new-task-force');
    this.route('meeting');
    this.route('ga-task-force');
    this.route('delete-task-force');
  });
});

export default Router;
