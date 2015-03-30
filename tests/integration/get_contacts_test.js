'use strict';
require('../bootstrap');
var MYOBConnector = require('../../lib/connector');
var config = require('config');
var expect = require('chai').expect;
var BBPromise = require('bluebird');
describe('MYOBConnector', function () {
  describe.only('#get /contacts', function () {
    this.timeout(5000);
    var _getContacts;
    before(function () {
      var settings = {
        accessToken: config.get('AccessToken'),
        username: config.get('Username'),
        password: config.get('Password'),
        refreshToken: config.get('RefreshToken'),
        fileId: config.get('FileId')
      };
      var authorization = {
        get: function (key) {
          return settings[key];
        },
        set: function (key, value) {
          console.log('setting key', key, value);
          settings[key] = value;
          return BBPromise.resolve(null);
        }
      };
      var connector = new MYOBConnector({
        clientId: config.get('ClientId'),
        clientSecret: config.get('ClientSecret'),

      });
      connector.authorize(authorization);
      _getContacts = connector.get('/Contact');
    });
    it('should return list of contacts', function () {
      return _getContacts.then(function (result) {
        expect(result.Items.length).to.eql(120);
      });
    });
  });
});
