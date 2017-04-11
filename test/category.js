var chai   = require('chai');
var expect = chai.expect;
var request = require('request');
var server   = require('../server');


describe('Category',

function () {

  it('List', function (done) {

    var options = {
        uri: 'http://localhost:8000/api/category',
        json: true,
        method: 'get'
    };

    request(options, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
    });

  });

  it('List 2', function (done) {

    var options = {
        uri: 'http://localhost:8000/api/category',
        json: true,
        method: 'get'
    };

    request(options, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.exist;
        done();
    });

  });

});
