'use strict';
var Connector = require('../../lib/connector');
var BBPromise = require('bluebird');
var config = require('config');
describe.skip('bounce flow', function () {
  var connector;
  before(function () {
    connector = new Connector({
      clientId: config.get('clientId'),
      clientSecret: config.get('clientSecret')
    });
  });
  describe('initial bounce', function () {
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
  describe('get request token bounce', function () {
    before(function () {
      var bounce = {
        query:{
          code:'ZT3a!IAAAAKIAnJGwyVHVkcC8Dif_4m2M6wAOz_QPLW9s-taiZqRg8QAAAAFt4yjYTrYTg3v0j7bBxgLISlQMrNGSCxHjOGRpH2es6V_zNBH36G5-Iv1U_l97ojyVykIashdMf0opLXqYeF4P2q4JUl1bgV4KyOE6xwqnoyI5rzJO0a55tLPob1MFNu84CHAo8q0NWSkOQIjXYiDKwXVaSYVAULG31VEVpuagUPS8xIQzuIJSACSDF1rvCReZtWxG8SH98wSlvdEKXwEqd8C020_CqvrlcjpChecxAtva-el-rviUdJQkj0oryCMuJ-rJEcntnRJQoHV8qYo2l4hoC2TQ7pf639leIq1Pw_63knOOeUVGSEYpsHodY9E'
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
