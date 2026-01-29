import {Request, Response, NextFunction } from 'express';
import winston from 'winston'


const {json, combine, simple, timestamp, errors} = winston.format;

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        simple(),
        json(),
        timestamp(),
        errors({stack: true})
    ),
    transports: [
        new winston.transports.File({filename: 'src/logs/error.log', level: 'error'}),
        new winston.transports.Console({format: simple()})
    ],
    exceptionHandlers:[
        new winston.transports.File({filename: 'src/logs/exceptions.log'}),
        new winston.transports.Console({format: combine(simple(), errors({stack: true}))})
    ],
    rejectionHandlers:[
        new winston.transports.File({filename: 'src/logs/rejections.log'}),
        new winston.transports.Console({format: combine(simple(), errors({stack: true}))})
    ],
    exitOnError: false
})

export const errorHandler = (err: Error, req: Request, res: Response<{Success: boolean, message: string} | {errors: string}>, next: NextFunction) => {
     if(err.name ==='ZodError'){
        return res.status(400).json({errors: err.message})
    }

    const statusCode = res.statusCode || 500;
    const message = err.message || 'Internal server Error';
    logger.error(`${err.name} ${req.method} ${req.path} ${err.message}: (error: ${err.stack})`)
    res.status(statusCode).json({
        Success: false,
        message
    })
}