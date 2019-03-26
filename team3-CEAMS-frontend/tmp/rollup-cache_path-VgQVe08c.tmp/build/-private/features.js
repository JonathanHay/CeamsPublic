export default function featureIsEnabled() {
  return Ember.FEATURES.isEnabled(...arguments);
}