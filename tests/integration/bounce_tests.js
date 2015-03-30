'use strict';
require('../bootstrap');
var Connector = require('../../lib/connector');
var BBPromise = require('bluebird');
var config = require('config');
var expect = require('chai').expect;
describe.skip('bounce flow', function () {
  var connector;
  before(function () {
    connector = new Connector({
      clientId: config.get('ClientId'),
      clientSecret: config.get('ClientSecret')
    });
  });
  describe('initial bounce', function () {
    var _redirect;
    before(function () {
      var bounce = {
        get: function () {
          return undefined;
        },
        delete: function () {
          return BBPromise.resolve(null);
        },
        set: function () {
          console.log('set', arguments);
          return BBPromise.resolve(null);
        },
        redirect: function () {
          console.log('redirect', arguments);
          _redirect = arguments[0];
          return BBPromise.resolve(null);
        },
        done: function () {
          console.log('done', arguments);
          return BBPromise.resolve(null);
        }
      };
      return connector.receiveBounce(bounce).catch(function (err) {
        console.log(err);
        throw err;
      });
    });
    it('should do some redirect', function () {
      expect(_redirect).to.eql('https://secure.myob.com/oauth2/account/authorize?scope=CompanyFile&response_type=code&redirect_uri=https%3A%2F%2Fbouncer.hoist.io%2Fbounce&client_id='+config.get('ClientId'));
    });
  });
  describe('get request token bounce', function () {
    this.timeout(50000);
    before(function () {
      var bounce = {
        query:{
          code:decodeURIComponent('ZT3a%21IAAAAODf-LuIFL38yd_4yyKGiA4TQKF8e7qASxBlxXZXOOxO8QAAAAHC5UrqWidxHyK1be6B7e_6EpehY56kIY3WMuUYNpEam3WOFjN61UPgJVmTxFpG4uUM4L9nj-qnJvQlTFt7cUJvMddVexgXHeKe07FCIM1a0NBnKW_xrJTzcwr8HU8g8P-Ep3XZV_p9Cvb2jwl3fof47CW-AddsewSTEPqMEXAZZTrstRDcvK4ZE3PWZfnMGnt9RgPN-BWJyOJ1AG4f1eqonLRSffc90EYlfqX4mI9M8shw8DUZHSrBHJoW3ZwJDLgdJa0FtLCRt9cPwflZEfsr3kaO2tosdiHZUXCvTsGIO8dIr45QvUWFo2w1pkJAPgM')
        },
        get: function (key) {
          if(key==='requestToken'){
            return true;
          }
        },
        delete: function () {
          return BBPromise.resolve(null);
        },
        set: function () {
          console.log('set', arguments);
          return BBPromise.resolve(null);
        },
        redirect: function () {
          console.log('redirect', arguments);
          return BBPromise.resolve(null);
        },
        done: function () {
          console.log('done', arguments);
          return BBPromise.resolve(null);
        }
      };
      return connector.receiveBounce(bounce).catch(function (err) {
        console.log(err);
        throw err;
      });
    });
    it('should do some redirect', function () {

    });

  });
});
