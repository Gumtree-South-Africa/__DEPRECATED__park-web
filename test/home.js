var chai   = require('chai');
var expect = chai.expect;
var request = require('request');
var server   = require('../server');

describe('Home', function () {

  it('Basic', function () {
    it('Server debe ser un objeto', function(){
      expect(server).to.be.a.object;
    });
  });


});
