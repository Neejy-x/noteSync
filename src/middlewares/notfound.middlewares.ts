import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response<{message: string}>, next: NextFunction): void => {
    res.status(404).json({message: 'Resource Not Found'})
}