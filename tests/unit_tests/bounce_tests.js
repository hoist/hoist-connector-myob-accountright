'use strict';
require('../bootstrap');
var MYOBConnector = require('../../lib/connector');
var sinon = require('sinon');
var expect = require('chai').expect;
var BBPromise = require('bluebird');
describe('MYOBConnector', function () {
  describe('#receiveBounce', function () {
    describe('when no bounce previous', function () {
      var mockBounce = {
        get: sinon.stub(),
        set: sinon.stub().returns(BBPromise.resolve(null)),
        redirect: sinon.stub(),
        done: sinon.stub()
      };
      before(function () {
        var connector = new MYOBConnector({
          clientId: 'clientId'
        });
        connector.receiveBounce(mockBounce);
      });
      it('redirects to MYOB auth url', function () {
        expect(mockBounce.redirect).to.have.been.calledWith('https://secure.myob.com.runscope.net/oauth2/account/authorize?scope=CompanyFile&response_type=code&redirect_uri=https%3A%2F%2Fbouncer.hoist.io%2Fbounce&client_id=clientId');
      });
      it('sets requestToken to be true', function () {
        expect(mockBounce.set).to.have.been.calledWith('requestToken', true);
      });
    });
    describe('on return from request token', function () {
      var _companyFile = {
        name: 'companyFile',
        Id: 'CompanyFileId'
      };
      var mockBounce = {
        query: {
          code: 'code'
        },
        get: sinon.stub(),
        set: sinon.stub().returns(BBPromise.resolve(null)),
        redirect: sinon.stub(),
        done: sinon.stub()
      };
      var connector;
      before(function () {
        connector = new MYOBConnector({
          clientId: 'clientId'
        });

        sinon.stub(connector.auth, 'getOAuthAccessTokenAsync').returns(BBPromise.resolve(['accessToken', 'refreshToken']));
        sinon.stub(connector, '_rp').returns(BBPromise.resolve([_companyFile]));
        mockBounce.get.withArgs('requestToken').returns(true);
        connector.receiveBounce(mockBounce);
      });
      it('saves access token', function () {
        expect(mockBounce.set).to.have.been.calledWith('accessToken', 'accessToken');

      });
      it('saves request token', function () {
        expect(mockBounce.set).to.have.been.calledWith('refreshToken', 'refreshToken');
      });
      it('requests company file', function () {
        expect(connector._rp).to.have.been.calledWith({
          headers: {
            Authorization: "Bearer accessToken",
            "Content-Type": "application/json",
            "User-Agent": "Hoist Integration (support@hoist.io)",
            "x-myobapi-key": "clientId",
            "x-myobapi-version": "v2"
          },
          json: true,
          method: "GET",
          uri: "https://api.myob.com/accountright/"
        });
      });
      it('saves company file',function(){
        expect(mockBounce.set).to.have.been.calledWith('fileId','CompanyFileId');
      });
    });
  });

});
