
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

    it('should add getValidatedQuery to request', function () {

        var middleware = expressValidator();
        var req = {};

        middleware(req, null, function () { })

        chai.expect(req.getValidatedQuery).to.be.a('function');
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

    it('getValidatedQuery should return value', function () {

        var middleware = expressValidator();
        var req = {
            body: {
                personId: 5
            },
            params: {
                id: 3
            },
            query: {
                userId: 3
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            var id = req.getValidatedQuery('userId', expressValidator.Joi.number().integer())
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

    it('getValidatedBody should strip additional value when stripUnknown: true', function () {
        var middleware = expressValidator({
            stripUnknown: true
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
            var dto = req.getValidatedBody(TestImplementationWithtSchema)
            if (dto.additionalValue) {
                throw Error('Invalid response.')
            }

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

    it('getValidatedQuery should throw error on incorrect value', function () {

        var middleware = expressValidator();
        var req = {
            body: {
                personId: 5
            },
            params: {
                id: 3
            },
            query: {
                userId: 'abc'
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            req.getValidatedQuery('userId', expressValidator.Joi.number().integer())
        }).to.throw(Error);
    });

    it('getValidatedQuery should return default value', function () {

        var middleware = expressValidator();
        var req = {
            body: {
                personId: 5
            },
            params: {
                id: 3
            },
            query: {
                userId: 'abc'
            }
        };

        middleware(req, null, function () { })

        chai.expect(function () {
            var id = req.getValidatedQuery('userId', expressValidator.Joi.number().integer(), 3)
            if (id == null || id != 3) {
                throw new Error('Invalid response.')
            }
        }).to.not.throw(Error);
    });

    it('getValidatedParam should return default value', function () {
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
           var id = req.getValidatedParam('id', expressValidator.Joi.number().integer(), 3)
            if (id == null || id != 3) {
                throw new Error('Invalid response.')
            }
        }).to.not.throw(Error);
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
