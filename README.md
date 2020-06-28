# Express Validator
Lightweight express validator.
## Install
    $ npm i @taraj/express-validator
## Basic usage
#### Configure middleware
```Typescript

import express, { Application } from 'express';
import expressValidator from 'express-validator';

//...

const app: Application = express();
app.use(express.json());

app.use(expressValidator());

//...

app.listen(3000, () => {
    console.log(`App is listening on port: 3000`);
});
```
#### Create DTO's
```Typescript
import { AbstractValidatedDto, Joi } from 'express-validator';


export class NewActorDto extends AbstractValidatedDto {
  name!: string;
  personId!: number;
  movieId!: number;

  protected getSchema(): Joi.SchemaMap {
    return {
      name: Joi.string().required().max(100),
      personId: Joi.number().integer().required(),
      movieId: Joi.number().integer().required()
    }
  }
}
```
#### Get DTO's in controller
```Typescript
import { Response, Application, Router, NextFunction, Request } from 'express';
import { NewActorDto } from './dto/newActor.dto';
import { Joi } from 'express-validator';
import actorService from './actor.service';



const router: Router = Router();

export const ActorController = (app: Application) => {

    //...

    router.put('/:actorId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const actorId: number = req.getValidatedParam('actorId', Joi.number().integer());
            const dto: NewActorDto = req.getValidatedBody(NewActorDto);
            await actorService.update(actorId, dto)
            res.send();
        } catch (err) {
            next(err);
        };
    });
    
    //...

    app.use('/actors', router);
}

```
## Validation 
All dto's need's to extends `AbstractValidatedDto` class
```Typescript
export abstract class AbstractValidatedDto {
    protected abstract getSchema(): SchemaMap;
    public validate(options: ValidationOptions): any;
}
```
if needed you can override `validate()` method and provide own validation strategy but by default you only need to implement `getSchema()`.
All available constraint for `getSchema()` you can find in `@hapi/joi` documentation (https://hapi.dev/module/joi/).

Example implementation can look like this:
```Typescript
protected getSchema(): Joi.SchemaMap {
      return {
          firstName: Joi.string().required().max(100),
          lastName: Joi.string().required().max(100),
          email: Joi.string().required().email(),
          password: Joi.string().required().min(3).max(100)
      }
  }
```
**IMPORTANT:** Object need to be **exactly** the same as schema because if it have any additional field error will be throwed. (can be changed in global settings)

Example class that override `validate` method
```Typescript
export class NewActorDto extends AbstractValidatedDto {
  name!: string;
  personId!: number;
  movieId!: number;

  protected getSchema(): Joi.SchemaMap {
    return {}
  }

  public validate(options: Joi.ValidationOptions): NewActorDto {
    if (this.name == '3') {
      throw Error('Custom validation.')
    }
    return this;
  }
}
```
## Global settings
You can set Joi validation options when register middleware.
```Typescript
app.use(expressValidator({
    stripUnknown: false,
    abortEarly: false
}));
```
## List of function added to `req`
```Typescript
/**
* Validates body against a schema, returns valid object, and throws if validation fails.
* 
* @param type - the expected class (must override AbstractValidatedDto)
*/
getValidatedBody: <T extends AbstractValidatedDto>(type: { new(): T; }) => T;

/**
* Validates request parm value against a schema, returns valid value,
* if validation fails throws error or return @param defaultValue if provided.
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
```
## License

[The MIT License](http://opensource.org/licenses/MIT)
