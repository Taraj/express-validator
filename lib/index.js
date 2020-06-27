var Joi = require("@hapi/joi");


var AbstractValidatedDto = function () {
    if (this.constructor === AbstractValidatedDto) {
        throw new Error("Can't instantiate abstract class!");
    }
};

AbstractValidatedDto.prototype.validate = function (options) {
    var error = Joi.object(this.getSchema()).validate(this, options).error;

    if (error != null) {
        throw error;
    }
}

AbstractValidatedDto.prototype.getSchema = function () {
    throw new Error("Not implemented!");
}

exports = module.exports = function (options = {}) {
    return function (req, res, next) {
        req.getValidatedBody = function (type) {
            var dto = Object.assign(new type(), req.body);
            if (dto.validate != null) {
                dto.validate(options);
                return dto;
            } else {
                throw new Error("Validate function missing.")
            }
        }

        req.getValidatedParam = function (name, joiSchema) {
            return Joi.attempt(req.params[name], joiSchema, options);
        }

        next();
    }
};

exports.Joi = Joi;
exports.AbstractValidatedDto = AbstractValidatedDto;