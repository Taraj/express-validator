
var chai = require('chai');
var expressValidator = require('..');

describe('exports', function () {

    it('should export express-validator middleware', function () {
        chai.expect(expressValidator).to.be.a('function');
    });

    it('should export AbstractValidatedDto', function () {
        chai.expect(expressValidator.AbstractValidatedDto).to.be.a('function');
    });

    it('should export Joi', function () {
        chai.expect(expressValidator.Joi).to.be.a('object');
    });

});