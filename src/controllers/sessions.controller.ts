import {Request, Response} from 'express'
import { AuthService } from '../services/auth.service'
import { DefaultResponse } from '../dto/responses/global.response'


export const getSessionsHandler = (req: Request, res: Response<DefaultResponse>) => {
     
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

export const endSessionHandler = async (req: Request, res: Response<DefaultResponse>) => {
    const sessionId = req.body
    if(!req.user){
        return res.status(403).json({Success: false, message: 'Unauthorized: user not validated'})
    }
    const { user_id }  = req.user
     const success = await AuthService.endSession({user_id, sessionId})
     if(!success) return res.status(404).json({Success: false, message: 'session previously terminated'})
    
        res.status(200).json({
            Success: true,
            message: 'Session terminated'
        })
}