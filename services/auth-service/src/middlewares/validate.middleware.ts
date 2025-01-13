import { Request, Response, NextFunction } from 'express';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateDto = (dtoClass: new () => object) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToClass(dtoClass, req.body);
      await validateOrReject(dtoObject);
      req.body = dtoObject;
      next();
    } catch (errors) {
      if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
        const formattedErrors = errors.map((error: ValidationError) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        res.status(400).json({ errors: formattedErrors });
      } else {
        res.status(500).json({ message: 'Erreur de validation' });
      }
    }
  };
};
