'use strict';
require('../bootstrap');
var MYOBConnector = require('../../lib/connector');
var sinon = require('sinon');
var expect = require('chai').expect;
var BBPromise = require('bluebird');
describe('MYOBConnector', function () {


  describe('#get', function () {
    var _connector;
    var _authorization;
    var _response = {
      response: true
    };
    before(function () {
      _connector = new MYOBConnector({
        clientId: 'clientId',
        clientSecret: 'clientSecret'
      });

      _authorization = {
        get: sinon.stub(),
        set: sinon.stub().returns(BBPromise.resolve(null))
      };
      _authorization.get.withArgs('accessToken').returns('accessToken');
      _authorization.get.withArgs('username').returns('username');
      _authorization.get.withArgs('password').returns('password');
      _authorization.get.withArgs('fileId').returns('companyFile');
      _connector.authorize(_authorization);

      sinon.stub(_connector, '_rp').returns(BBPromise.resolve(_response));
    });
    describe('company file url', function () {
      before(function () {
        return _connector.get('/');
      });
      it('requests root url', function () {
        expect(_connector._rp).to.have.been.calledWithMatch(sinon.match.has('uri', 'https://api.myob.com/accountright/'));
      });
      it('adds authorization header', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers', sinon.match.has('Authorization', 'Bearer accessToken')));
      });
      it('sets myob headers', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers',
            sinon.match.has('x-myobapi-cftoken', 'dXNlcm5hbWU6cGFzc3dvcmQ=')
            .and(sinon.match.has('x-myobapi-key', 'clientId'))
            .and(sinon.match.has('x-myobapi-version', 'v2'))
          ));
      });
      it('makes a get request', function () {
        expect(_connector._rp)
          .to.have.been.calledWith(sinon.match.has('method', 'GET'));
      });
    });
    describe('contact url', function () {
      before(function () {
        return _connector.get('/Contact');
      });
      it('requests root url', function () {
        expect(_connector._rp).to.have.been.calledWithMatch(sinon.match.has('uri', 'https://api.myob.com/accountright/companyFile/Contact'));
      });
      it('adds authorization header', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers', sinon.match.has('Authorization', 'Bearer accessToken')));
      });
      it('sets myob headers', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers',
            sinon.match.has('x-myobapi-cftoken', 'dXNlcm5hbWU6cGFzc3dvcmQ=')
            .and(sinon.match.has('x-myobapi-key', 'clientId'))
            .and(sinon.match.has('x-myobapi-version', 'v2'))
          ));
      });
    });
  });
  describe('#post', function () {
    var _connector;
    var _authorization;
    var _response = {
      response: true
    };
    before(function () {
      _connector = new MYOBConnector({
        clientId: 'clientId',
        clientSecret: 'clientSecret'
      });

      _authorization = {
        get: sinon.stub(),
        set: sinon.stub().returns(BBPromise.resolve(null))
      };
      _authorization.get.withArgs('accessToken').returns('accessToken');
      _authorization.get.withArgs('username').returns('username');
      _authorization.get.withArgs('password').returns('password');
      _authorization.get.withArgs('fileId').returns('companyFile');
      _connector.authorize(_authorization);

      sinon.stub(_connector, '_rp').returns(BBPromise.resolve(_response));
    });
    describe('contact url', function () {
      var _postBody = {
        posted: true
      };
      before(function () {
        return _connector.post('/Contact', _postBody);
      });
      it('requests root url', function () {
        expect(_connector._rp).to.have.been.calledWithMatch(sinon.match.has('uri', 'https://api.myob.com/accountright/companyFile/Contact'));
      });
      it('adds authorization header', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers', sinon.match.has('Authorization', 'Bearer accessToken')));
      });
      it('sets myob headers', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers',
            sinon.match.has('x-myobapi-cftoken', 'dXNlcm5hbWU6cGFzc3dvcmQ=')
            .and(sinon.match.has('x-myobapi-key', 'clientId'))
            .and(sinon.match.has('x-myobapi-version', 'v2'))
          ));
      });
      it('makes a post request', function () {
        expect(_connector._rp)
          .to.have.been.calledWith(sinon.match.has('method', 'POST'));
      });
      it('sets the body', function () {
        expect(_connector._rp)
          .to.have.been.calledWith(sinon.match.has('body', _postBody));
      });
    });
  });
  describe('#put', function () {
    var _connector;
    var _authorization;
    var _response = {
      response: true
    };
    before(function () {
      _connector = new MYOBConnector({
        clientId: 'clientId',
        clientSecret: 'clientSecret'
      });

      _authorization = {
        get: sinon.stub(),
        set: sinon.stub().returns(BBPromise.resolve(null))
      };
      _authorization.get.withArgs('accessToken').returns('accessToken');
      _authorization.get.withArgs('username').returns('username');
      _authorization.get.withArgs('password').returns('password');
      _authorization.get.withArgs('fileId').returns('companyFile');
      _connector.authorize(_authorization);

      sinon.stub(_connector, '_rp').returns(BBPromise.resolve(_response));
    });
    describe('contact url', function () {
      var _postBody = {
        posted: true
      };
      before(function () {
        return _connector.put('/Contact', _postBody);
      });
      it('requests root url', function () {
        expect(_connector._rp).to.have.been.calledWithMatch(sinon.match.has('uri', 'https://api.myob.com/accountright/companyFile/Contact'));
      });
      it('adds authorization header', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers', sinon.match.has('Authorization', 'Bearer accessToken')));
      });
      it('sets myob headers', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers',
            sinon.match.has('x-myobapi-cftoken', 'dXNlcm5hbWU6cGFzc3dvcmQ=')
            .and(sinon.match.has('x-myobapi-key', 'clientId'))
            .and(sinon.match.has('x-myobapi-version', 'v2'))
          ));
      });
      it('makes a put request', function () {
        expect(_connector._rp)
          .to.have.been.calledWith(sinon.match.has('method', 'PUT'));
      });
      it('sets the body', function () {
        expect(_connector._rp)
          .to.have.been.calledWith(sinon.match.has('body', _postBody));
      });
    });
  });
describe('#delete', function () {
    var _connector;
    var _authorization;
    var _response = {
      response: true
    };
    before(function () {
      _connector = new MYOBConnector({
        clientId: 'clientId',
        clientSecret: 'clientSecret'
      });

      _authorization = {
        get: sinon.stub(),
        set: sinon.stub().returns(BBPromise.resolve(null))
      };
      _authorization.get.withArgs('accessToken').returns('accessToken');
      _authorization.get.withArgs('username').returns('username');
      _authorization.get.withArgs('password').returns('password');
      _authorization.get.withArgs('fileId').returns('companyFile');
      _connector.authorize(_authorization);

      sinon.stub(_connector, '_rp').returns(BBPromise.resolve(_response));
    });
    describe('contact url', function () {

      before(function () {
        return _connector.delete('/Contact');
      });
      it('requests root url', function () {
        expect(_connector._rp).to.have.been.calledWithMatch(sinon.match.has('uri', 'https://api.myob.com/accountright/companyFile/Contact'));
      });
      it('adds authorization header', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers', sinon.match.has('Authorization', 'Bearer accessToken')));
      });
      it('sets myob headers', function () {
        expect(_connector._rp)
          .to.have.been
          .calledWithMatch(sinon.match.has('headers',
            sinon.match.has('x-myobapi-cftoken', 'dXNlcm5hbWU6cGFzc3dvcmQ=')
            .and(sinon.match.has('x-myobapi-key', 'clientId'))
            .and(sinon.match.has('x-myobapi-version', 'v2'))
          ));
      });
      it('makes a delete request', function () {
        expect(_connector._rp)
          .to.have.been.calledWith(sinon.match.has('method', 'DELETE'));
      });

    });
  });
});
