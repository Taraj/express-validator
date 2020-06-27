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

  protected get schema(): Joi.SchemaMap {
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
import { Joi } from 'express-validator'
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
abstract class AbstractValidatedDto {
    protected abstract get schema(): SchemaMap;
    public validate(): void;
}
```
if needed you can override `validate` method and provide own validation strategy but by default you only need to implement `schema`.
All available constraint for `schema` you can find in `@hapi/joi` documentation (https://hapi.dev/module/joi/).

Example implementation can look like this:
```Typescript
protected get schema(): Joi.SchemaMap {
      return {
          firstName: Joi.string().required().max(100),
          lastName: Joi.string().required().max(100),
          email: Joi.string().required().email(),
          password: Joi.string().required().min(3).max(100)
      }
  }
```
**IMPORTANT:** Object need to be **exactly** the same as schema because if it have any additional field error will be throwed.

Example class that override `validate` method
```Typescript
export class NewActorDto extends AbstractValidatedDto {
  name!: string;
  personId!: number;
  movieId!: number;

  protected get schema(): Joi.SchemaMap {
    return {}
  }

  public validate() {
    if (this.name == '3') {
      throw Error('Custom validation.')
    }
  }
}
```
## License

[The MIT License](http://opensource.org/licenses/MIT)
