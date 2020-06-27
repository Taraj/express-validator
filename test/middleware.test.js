
var chai = require('chai');
var expressValidator = require('..');



describe('middleware', function () {

    it('should add getValidatedBody to request', function () {

        var middleware = expressValidator();
        var req = {};

        middleware(req, null, function () { })

        chai.expect(req.getValidatedBody).to.be.a('function');
    });

    it('should add getValidatedParam to request', function () {

        var middleware = expressValidator();
        var req = {};

        middleware(req, null, function () { })

        chai.expect(req.getValidatedParam).to.be.a('function');
    });

    it('getValidatedBody should return value', function () {

        var middleware = expressValidator();
        var req = {
            body: {
                personId: 5
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            var dto = req.getValidatedBody(TestImplementationWithtSchema)
            if (dto == null || dto.personId != 5) {
                throw new Error('Invalid response.')
            }
        }).to.not.throw(Error);
    });

    it('getValidatedParam should return value', function () {

        var middleware = expressValidator();
        var req = {
            body: {
                personId: 5
            },
            params: {
                id: 3
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            var id = req.getValidatedParam('id', expressValidator.Joi.number().integer())
            if (id == null || id != 3) {
                throw new Error('Invalid response.')
            }
        }).to.not.throw(Error);
    });

    it('getValidatedBody should throw error on additional value', function () {
        var middleware = expressValidator();
        var req = {
            body: {
                personId: 5,
                additionalValue: 10
            },
            params: {
                id: 3
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            req.getValidatedBody(TestImplementationWithtSchema)
        }).to.throw(Error);
    });
    it('getValidatedBody should not throw error on additional value when allowUnknown: true', function () {
        var middleware = expressValidator({
            allowUnknown: true
        });
        var req = {
            body: {
                personId: 5,
                additionalValue: 10
            },
            params: {
                id: 3
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            req.getValidatedBody(TestImplementationWithtSchema)
        }).to.not.throw(Error);
    });

    it('getValidatedBody should throw error on incorrect value', function () {
        var middleware = expressValidator();
        var req = {
            body: {
                personId: 'abcd'
            },
            params: {
                id: 3
            }
        };

        middleware(req, null, function () { })
        chai.expect(function () {
            req.getValidatedBody(TestImplementationWithtSchema)
        }).to.throw(Error);
    });

    it('getValidatedParam should throw error on incorrect value', function () {
        var middleware = expressValidator();
        var req = {
            body: {
                personId: 'abcd'
            },
            params: {
                id: 'abcd'
            }
        };

        middleware(req, null, function () { })
        chai.expect(function () {
            req.getValidatedParam('id', expressValidator.Joi.number().integer())
        }).to.throw(Error);
    });

});


class TestImplementationWithtSchema extends expressValidator.AbstractValidatedDto {
    constructor(personId) {
        super();
        this.personId = personId;
    }
    getSchema() {
        return {
            personId: expressValidator.Joi.number().integer().required()
        }
    }
}
