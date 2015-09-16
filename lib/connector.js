'use strict';
var BBPromise = require('bluebird');
var OAuth = require('@hoist/oauth').OAuth2;
var _ = require('lodash');
var logger = require('@hoist/logger');
var errors = require('@hoist/errors');
var requestPromise = require('request-promise');
var config = require('config');

function MYOBConnector(settings) {

  logger.info({
    settings: settings
  }, 'constructed myob connector');
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

MYOBConnector.prototype.get = function (path, options) {
  return this._request('GET', path, null, null, options);
};

MYOBConnector.prototype.post = function (path, data, options) {
  return this._request('POST', path, null, data, options);
};
MYOBConnector.prototype.put = function (path, data, options) {
  return this._request('PUT', path, null, data, options);
};
MYOBConnector.prototype.delete = function (path, options) {
  return this._request('DELETE', path, null, null, options);
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
MYOBConnector.prototype._request = function (method, path, queryParams, data, optionsToAdd) {
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

    if (optionsToAdd) {
      options = _.extend(options, _.pick(optionsToAdd, ["resolveWithFullResponse"])); //Only allow certain options to be overridden
    }
    
    if (data) {
      options.body = data;
    }
    logger.info({
      options: options
    }, 'making a myob request');
    return this._rp(options);
  }, [], this).bind(this)

  .catch(function (err) {
    logger.error(err);
    /* istanbul ignore next */
    if (err.name === 'StatusCodeError' && err.statusCode === 401) {
      logger.info({
        messsage: err.message
      }, "refreshing access token due to StatusCodeError");
      return this._refreshAccessToken()
        .bind(this).then(function () {
          return this._request(method, path, queryParams, data);
        });
    } else {
      logger.info("error occured");
      throw err;
    }
  });

};

MYOBConnector.prototype.receiveBounce = function (bounce) {
  logger.info("recieved bounce");
  if (bounce.get('requestToken')) {
    logger.info("getting oauth access token");
    return this.auth.getOAuthAccessTokenAsync(bounce.query.code, {
      scope: 'CompanyFile',
      /*jshint camelcase: false */
      grant_type: 'authorization_code',
      redirect_uri: 'https://' + config.get('Hoist.domains.bouncer') + '/bounce'
    }).bind(this).then(function (response) {
      logger.info({
        response: [response[0], response[1]]
      }, "got access token response");
      return BBPromise.all([
          bounce.set('accessToken', response[0]),
          bounce.set('refreshToken', response[1])
        ]).bind(this)
        .then(function () {
          logger.info("getting company file list");
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
            logger.info('got company file response');
            if (companyFiles.length > 0) {
              logger.info('setting company file id');
              return bounce.set('fileId', companyFiles[0].Id);
            }
          });
        });
    }).then(function () {
      return bounce.done();
    });
  } else {
    /* First hit */
    /*jshint camelcase: false */
    logger.info("getting request token");
    return bounce.set('requestToken', true)
      .bind(this)
      .then(function () {
        logger.info("redirecting user to myob");
        bounce.redirect(this.auth.getAuthorizeUrl({
          scope: 'CompanyFile',
          response_type: 'code',
          redirect_uri: 'https://bouncer.hoist.io/bounce'
        }));
      });
  }

};


module.exports = MYOBConnector;
