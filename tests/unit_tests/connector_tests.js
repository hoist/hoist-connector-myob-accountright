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
});
