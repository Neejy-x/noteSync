import type {Request, Response} from 'express'
import { AuthService } from '../services/auth.service'


export const sessionsHandler = (req: Request, res: Response<{Success: boolean, message: string, data?: {} }>) => {
     
    if(!req.user){
        return res.status(401).json({Success: false, message: 'Unauthorized: user not authenticated'})
    }
    const {user_id} = req.user
    
    const sessions = AuthService.getSessions(user_id)
    res.status(200).json({
        Success: true,
        message: 'Active sessions',
        data: sessions
    })
}