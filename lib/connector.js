'use strict';
var BBPromise = require('bluebird');
var OAuth = require('oauth').OAuth2;
var _ = require('lodash');
var logger = require('@hoist/logger');
var errors = require('@hoist/errors');
var requestPromise = require('request-promise');

function MYOBConnector(settings) {

  logger.info({
    settings: settings
  }, 'constructed highrise-connector');
  this.settings = settings;
  this.auth = new OAuth(
    settings.clientId,
    settings.clientSecret,
    'https://secure.myob.com/oauth2/',
    'account/authorize',
    'v1/authorize'
  );
  this.auth.getOAuthAccessTokenAsync = BBPromise.promisify(this.auth.getOAuthAccessToken);
  _.bindAll(this);
}


/* istanbul ignore next */
MYOBConnector.prototype.authorize = function (authorization) {
  this.authorization = authorization;
};

/* istanbul ignore next */
MYOBConnector.prototype.setUsernameAndPassword = function (username, password) {
  if (this.authorization) {
    this.authorization.set('username', username);
    this.authorization.set('password', password);
  }
};

MYOBConnector.prototype._rp = function (options) {
  return requestPromise(options);
};

MYOBConnector.prototype.get = function (path) {
  return this._request('GET', path);
};

MYOBConnector.prototype.post = function (path, data) {
  return this._request('POST', path, null, data);
};
MYOBConnector.prototype.put = function (path, data) {
  return this._request('PUT', path, null, data);
};
MYOBConnector.prototype.delete = function (path) {
  return this._request('DELETE', path);
};

MYOBConnector.prototype._generateUrl = function (path, queryParams) {
  if (path !== '/') {
    path = '/' + this.authorization.get('fileId') + path;
  }
  var url = 'https://api.myob.com/accountright' + path;
  var uri = require('url').parse(url, true);
  /* istanbul ignore if */
  if (this.settings.runscopeBucket) {
    delete uri.host;
    uri.hostname = uri.hostname.replace(/-/g, '--');
    uri.hostname = uri.hostname.replace(/\./g, '-');
    uri.hostname = uri.hostname + '-' + this.settings.runscopeBucket + '.runscope.net';
  }
  /* istanbul ignore if */
  if (queryParams) {
    uri.query = _.merge(uri.query, queryParams);
  }
  return require('url').format(uri);
};

/* istanbul ignore next */
MYOBConnector.prototype._refreshAccessToken = function () {
  return BBPromise.try(function refreshToken() {
      var options = {
        uri: 'https://secure.myob.com/oauth2/v1/authorize',
        method: 'POST',
        json: true,
        form: {
          'client_id': this.settings.clientId,
          'client_secret': this.settings.clientSecret,
          'refresh_token': this.authorization.get('refreshToken'),
          'grant_type': 'refresh_token'
        }
      };
      return this._rp(options);
    }, [], this).bind(this)
    .then(function (response) {
      /* jshint camelcase:false */
      return BBPromise.all([
        this.authorization.set('accessToken', response.access_token),
        this.authorization.set('refreshToken', response.refresh_token)
      ]);
    });
};
MYOBConnector.prototype._request = function (method, path, queryParams, data) {
  return BBPromise.try(function makeRequest() {
    if (!path) {
      throw new errors.connector.request.InvalidError('no path specified');
    }

    logger.info({
      method: method,
      path: path
    }, 'inside hoist-connector-myob-accountright.request');
    var uri = this._generateUrl(path, queryParams);
    var options = {
      uri: uri,
      method: method,
      json: true,
      headers: {
        "User-Agent": "Hoist Integration (support@hoist.io)",
        "Authorization": "Bearer " + this.authorization.get('accessToken'),
        "Content-Type": "application/json",
        "x-myobapi-key": this.settings.clientId,
        "x-myobapi-version": "v2",
        "x-myobapi-cftoken": new Buffer(this.authorization.get('username') + ":" + this.authorization.get('password')).toString('base64')
      }
    };
    if (data) {
      options.body = data;
    }
    return this._rp(options);
  }, [], this).bind(this)

  .catch(function (err) {
    /* istanbul ignore next */
    if (err.name === 'StatusCodeError') {
      return this._refreshAccessToken()
        .bind(this).then(function () {
          return this._rp(method, path, queryParams, data);
        });
    } else {
      throw err;
    }
  });

};

MYOBConnector.prototype.receiveBounce = function (bounce) {
  if (bounce.get('requestToken')) {
    return this.auth.getOAuthAccessTokenAsync(bounce.query.code, {
      scope: 'CompanyFile',
      /*jshint camelcase: false */
      grant_type: 'authorization_code',
      redirect_uri: 'https://bouncer.hoist.io/bounce'
    }).bind(this).then(function (response) {
      return BBPromise.all([
          bounce.set('accessToken', response[0]),
          bounce.set('refreshToken', response[1])
        ]).bind(this)
        .then(function () {
          return this._rp({
            method: 'GET',
            uri: 'https://api.myob.com/accountright/',
            json: true,
            headers: {
              "User-Agent": "Hoist Integration (support@hoist.io)",
              "Authorization": "Bearer " + response[0],
              "Content-Type": "application/json",
              "x-myobapi-key": this.settings.clientId,
              "x-myobapi-version": "v2"
            }
          }).then(function (companyFiles) {
            if (companyFiles.length > 0) {
              return bounce.set('fileId', companyFiles[0].Id);
            }
          });
        });
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
