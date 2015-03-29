'use strict';
var BBPromise = require('bluebird');
var OAuth = require('oauth').OAuth2;
var _ = require('lodash');
var logger = require('hoist-logger');

function MYOBConnector(settings) {

  logger.info({
    settings: settings
  }, 'constructed highrise-connector');
  this.settings = settings;
  this.auth = new OAuth(
    settings.clientId,
    settings.clientSecret,
    'https://secure-myob-com-s404txkcwglf.runscope.net/oauth2/',
    'account/authorize',
    'v1/authorize'
  );
  this.auth.getOAuthAccessTokenAsync = BBPromise.promisify(this.auth.getOAuthAccessToken);
  _.bindAll(this);
}


/* istanbul ignore next */
MYOBConnector.prototype.authorize = function () {

};



MYOBConnector.prototype.receiveBounce = function (bounce) {
  if (bounce.get('requestToken')) {
    return this.auth.getOAuthAccessTokenAsync(bounce.query.code, {
      scope: 'CompanyFile',
      /*jshint camelcase: false */
      grant_type: 'authorization_code',
      redirect_uri: 'https://bouncer.hoist.io/bounce'
    }).then(function (response) {
      console.log(response);
    });
  } else {
    /* First hit */
    /*jshint camelcase: false */
    return bounce.set('requestToken', true)
      .bind(this)
      .then(function () {
        bounce.redirect(this.auth.getAuthorizeUrl({
          scope: 'CompanyFile',
          response_type: 'code',
          redirect_uri: 'https://bouncer.hoist.io/bounce'
        }));
      });
  }

};


module.exports = MYOBConnector;
