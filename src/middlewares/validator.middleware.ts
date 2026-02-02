import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";


export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    
    const result = schema.safeParse(req.body)
    if(!result.success){
        return next(result.error)
    }
    req.body = result.data
    next()
}