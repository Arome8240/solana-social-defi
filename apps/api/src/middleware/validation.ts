import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: errors,
      });
      return;
    }

    next();
  };
};

export const schemas = {
  signup: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createPost: Joi.object({
    content: Joi.string().max(5000).required(),
    media: Joi.array().items(Joi.string().uri()).optional(),
  }),

  createComment: Joi.object({
    text: Joi.string().max(1000).required(),
  }),

  createMiniApp: Joi.object({
    name: Joi.string().required(),
    embedUrl: Joi.string().uri().optional(),
    codeSnippet: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
  }),
};
