var Joi = require("joi");


function validate(req, res, next) {
    req.getValidatedBody = function (type) {
        var dto = Object.assign(new type(), req.body);
        if (dto.validate != null) {
            dto.validate();
            return dto;
        } else {
            throw new Error("Validate function missing.")
        }
    }

    req.getValidatedParam = function (name, joiSchema) {
        return Joi.attempt(req.params[name], joiSchema);
    }

    next();
}

var AbstractValidatedDto = function () {
    if (this.constructor === AbstractValidatedDto) {
        throw new Error("Can't instantiate abstract class!");
    }
};

AbstractValidatedDto.prototype.validate = function () {
    var error = Joi.object(this.schema).validate(this).error;

    if (error != null) {
        throw error;
    }
}


exports = module.exports = function () {
    return validate
};

exports.Joi = Joi;
exports.AbstractValidatedDto = AbstractValidatedDto;