var chai = require('chai');
var { AbstractValidatedDto, Joi } = require('..');

describe('validation', function () {

    it('should be valid', function () {
        var obj = new TestImplementationWithtSchema(1);
        chai.expect(function () {
            obj.validate()
        }).to.not.throw(Error);
    });

    it('should be invalid', function () {
        var obj = new TestImplementationWithtSchema('abc');
        chai.expect(function () {
            obj.validate()
        }).to.throw(Error);
    });

});


class TestImplementationWithtSchema extends AbstractValidatedDto {

    constructor(personId) {
        super();
        this.personId = personId;
    }

    getSchema() {
        return {
            personId: Joi.number().integer().required()
        }
    }
}