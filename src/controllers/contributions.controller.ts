import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { contributionsService } from "../services/contributions.service";
import { contributionsInviteType } from "../dto/input/contributions.input";



export const sendInviteHandler = catchAsync(async(req: Request<contributionsInviteType['params'], {}, contributionsInviteType['body']>, res: Response) => {
    const {noteId} = req.params
    if(!req.user) return res.status(403).json({Successs: false, message: 'Unauthorized: user is unauthenticated'})
    const {user_id} = req.user
    const {username, permission} = req.body

    await contributionsService.sendInvite({user_id, noteId, username, permission})

})