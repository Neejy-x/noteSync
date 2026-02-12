import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { contributionsService } from "../services/contributions.service";
import { contributionsInviteType } from "../dto/input/contributions.input";
import { DefaultResponse } from "../dto/responses/global.response";



export const sendInviteHandler = catchAsync(async(req: Request<contributionsInviteType['params'], {}, contributionsInviteType['body']>, res: Response<DefaultResponse>) => {
    const {noteId} = req.params
    if(!req.user) return res.status(403).json({Success: false, message: 'Unauthorized: user is unauthenticated'})
    const {user_id} = req.user
    const {username, permission} = req.body

    await contributionsService.sendInvite({user_id, noteId, username, permission})
    res.status(201).json({
        Success: true,
        message: 'Invite sent'
    })

})


export const getContributionsHandler = catchAsync(async(req: Request, res: Response) => {

})