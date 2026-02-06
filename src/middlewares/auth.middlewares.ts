import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: string;
      };
    }
  }
}


export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization']
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({Success: false, message: 'Unauthorised: no token provided'})
    }
    const token = authHeader.split(' ')[1]
    try{

    const decoded = jwt.verify(token, String(process.env.JWT_SECRET)) as {userId: string, role: string}
    req.user = {
        user_id: decoded.userId,
        role: decoded.role
    }
    next()
    }catch(err){
    throw err
    }
}
