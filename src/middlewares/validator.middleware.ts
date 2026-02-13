import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";


export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    })
   if (!result.success) {
  const error = new ZodError(result.error.issues)
  return next(error)
}
    const { body, params, query } = result.data as { body: any; params: any; query: any };
    req.body = body
    req.params = params
    req.query = query
    return next()
}