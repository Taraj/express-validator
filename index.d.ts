// Type definitions for express-validator 1.0.7
// Project: express-validator
// Definitions by: Taraj <https://github.com/Taraj>

import { SchemaMap, AnySchema, ValidationOptions } from '@hapi/joi';
import { RequestHandler } from 'express';
import Joi = require('@hapi/joi');


declare global {
    namespace Express {
        interface Request {

            /**
             * Validates body against a schema, returns valid object, and throws if validation fails.
             * 
             * @param type - the expected class (must override AbstractValidatedDto)
             */
            getValidatedBody: <T extends AbstractValidatedDto>(type: { new(): T; }) => T;

            /**
             * Validates request parm value against a schema, returns valid value,
             *  if validation fails throws error or return @param defaultValue if provided.
             * 
             * @param parmName - the name of param.
             * @param schema - the schema object.
             * @param defaultValue - optional value returned if validation fails
             */
            getValidatedParam: (paramName: string, schema: AnySchema, defaultValue?: any) => any;

            /**
             * Validates request query value against a schema, returns valid value,
             * if validation fails throws error or return @param defaultValue if provided.
             * 
             * @param queryName  - the name of query.
             * @param schema - the schema object.
             * @param defaultValue - optional value returned if validation fails
             */
            getValidatedQuery: (queryName: string, schema: AnySchema, defaultValue?: any) => any;
        }
    }
}


/**
 * All dto's needs to extend this class and implement `getSchema()` method
 */
export abstract class AbstractValidatedDto {

    /**
     * Method returning `Joi.SchemaMap` to validate object
     */
    protected abstract getSchema(): SchemaMap;
    
    /**
     * Method called by middleware when validate. 
     * Should throw error when object is invalid or if object is valid return it
     */
    public validate(options: ValidationOptions): any;
}

/**
 * express-validator middleware
 * 
 */
export default function (options?: ValidationOptions): () => RequestHandler;

export { Joi };
