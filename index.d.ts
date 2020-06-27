// Type definitions for express-validator 1.0.0
// Project: express-validator
// Definitions by: Taraj <https://github.com/Taraj>

import { SchemaMap, AnySchema, ValidationOptions } from '@hapi/joi';
import { RequestHandler } from 'express';
export * as Joi from '@hapi/joi';

declare global {
    namespace Express {
        interface Request {
            getValidatedBody: <T extends AbstractValidatedDto>(type: { new(): T; }) => T;
            getValidatedParam: (parmName: string, schema: AnySchema) => any;
        }
    }
}

export abstract class AbstractValidatedDto {
    protected abstract getSchema(): SchemaMap;
    public validate(options: ValidationOptions): void;
}

export default function (options: ValidationOptions): () => RequestHandler;
