
import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr(),
    encryptedPassword: DS.attr(),
    salt: DS.attr(),
    userAccountExpiryDate: DS.attr(),
    passwordMustChanged: DS.attr(),
    passwordReset: DS.attr()
});
