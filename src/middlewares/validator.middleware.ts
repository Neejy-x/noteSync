import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod/v3";


export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    })
    if(!result.success){
        return next(result.error)
    }
    req.body = result.data.body
    req.params = result.data.params
    req.query = result.data.query
    return next()
}