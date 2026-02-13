import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { contributionsService } from "../services/contributions.service";
import { acceptContributionsInput, contributionsInviteType, getContributionsInvitesInput } from "../dto/input/contributions.input";
import { DefaultResponse } from "../dto/responses/global.response";
import { DefaultAgent } from "express-useragent";



export const sendInviteHandler = catchAsync(
    async(
        req: Request<contributionsInviteType['params'], {}, contributionsInviteType['body']>,
        res: Response<DefaultResponse>) => {
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


export const getContributionsInvitesHandler = catchAsync(
    async(
        req: Request<{}, {}, {}, getContributionsInvitesInput['query']>,
        res: Response<DefaultResponse>) => {
            
    if(!req.user) return res.status(401).json({Success: false, message: 'Unauthorized: user not authenticated'})
    const page = req.query.page ? Number(req.query.page) : 1
    const limit = req.query.limit ? Number(req.query.limit) : 10
    const user_id = req.user.user_id

    const invites = await contributionsService.getAllInvites({user_id, page, limit})

    res.status(200).json({
        Success: true,
        message: '',
        data: invites
    })

})


export const acceptContributionsHandler = catchAsync(async(req: Request<acceptContributionsInput['params']>, res: Response<DefaultResponse>) => {

    if(!req.user) return res.status(401).json({Success: false, message: 'Unauthorized: user is unauthenticated'})
    const noteId = req.params.noteId
    const user_id = req.user.user_id
    await contributionsService.acceptInvite({user_id, noteId})

})