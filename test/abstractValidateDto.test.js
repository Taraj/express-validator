var chai = require('chai');
var AbstractValidatedDto = require('..').AbstractValidatedDto;

describe('AbstractValidatedDto', function () {

    it('should be abstract', function () {
        chai.expect(function () {
            new AbstractValidatedDto();
        }).to.throw(Error);
    });

    it('should require getSchema() implementation', function () {
        var obj = new TestImplementationWithoutSchema();
        chai.expect(function () {
            obj.getSchema();
        }).to.throw(Error);
    });

    it('shouldn\'t require valdate() implementation', function () {
        var obj = new TestImplementationWithtSchema();
        chai.expect(function () {
            obj.validate();
        }).to.not.throw(Error)
    });

});

class TestImplementationWithoutSchema extends AbstractValidatedDto {

}

class TestImplementationWithtSchema extends AbstractValidatedDto {
    getSchema() {
        return {}
    }
}