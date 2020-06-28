var Joi = require("@hapi/joi");


var AbstractValidatedDto = function () {
    if (this.constructor === AbstractValidatedDto) {
        throw new Error("Can't instantiate abstract class!");
    }
};

AbstractValidatedDto.prototype.validate = function (options) {
    var { error, value } = Joi.object(this.getSchema()).validate(this, options);
    if (error != null) {
        throw error;
    }

    return value;
}

AbstractValidatedDto.prototype.getSchema = function () {
    throw new Error("Not implemented!");
}

exports = module.exports = function (options = {}) {
    return function (req, res, next) {
        req.getValidatedBody = function (type) {
            var dto = Object.assign(new type(), req.body);
            if (dto.validate != null) {
                return dto.validate(options);
            } else {
                throw new Error("Validate function missing.")
            }
        }

        req.getValidatedParam = function (name, joiSchema, defaultValue = null) {
            if (defaultValue) {
                var { error, value } = joiSchema.validate(req.params[name], options);
                if (error != null) {
                    return defaultValue;
                }
                return value;
            }
            return Joi.attempt(req.params[name], joiSchema, options);
        }

        req.getValidatedQuery = function (name, joiSchema, defaultValue = null) {
            if (defaultValue) {
                var { error, value } = joiSchema.validate(req.query[name], options);
                if (error != null) {
                    return defaultValue;
                }
                return value;
            }
            return Joi.attempt(req.query[name], joiSchema, options);
        }

        next();
    }
};

exports.Joi = Joi;
exports.AbstractValidatedDto = AbstractValidatedDto;