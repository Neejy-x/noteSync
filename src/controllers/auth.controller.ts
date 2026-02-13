import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { DefaultResponse, UserDTO } from '../dto/responses/global.response';
import { loginInput, SignUpInput } from '../validators/auth.validators';
import { catchAsync } from '../utils/catchAsync';



export const signUpHandler = catchAsync(async (
    req: Request<{}, {}, SignUpInput['body']>,
    res: Response<DefaultResponse & {accessToken: string}>
) => {
    const ua = req.useragent;
    const platform = ua?.isMobile ? 'Mobile' : ua?.isDesktop ? 'Desktop' : 'Tablet';
    const deviceName = `${ua?.browser} on ${ua?.os} (${platform})`
    const ip =  req.ip || req.socket.remoteAddress
    const {username, password, email} = req.body;
    const {user, accessToken, refreshToken} = await AuthService.signUp({username, password, email, deviceName, ip})
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({
        Success: true,
        message: 'Sign up successful',
        data: {
            ...user,
        },
        accessToken
    })
})

export const loginHandler = catchAsync(async(
    req: Request<{}, {}, loginInput['body']>, 
    res:Response<DefaultResponse & {accessToken: string}>
) => {
    const ua = req.useragent
    const platform = ua?.isMobile ? 'Mobile' : ua?.isDesktop ? 'Desktop' : 'Tablet'
    const deviceName = `${ua?.browser} on ${ua?.os} (${platform})`
    const ip = req.ip || req.socket.remoteAddress
    const username = req.body.username
    const password = req.body.password
    const {user, accessToken, refreshToken} = await AuthService.login({username, password, deviceName, ip})

    res.cookie('jwt', refreshToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    res.status(201).json({
        Success: true,
        message: 'Login Successful',
        data: user,
        accessToken
    })

})

export const logoutHandler = 
catchAsync(async(
    req:Request, 
    res:Response<DefaultResponse>
) => {
    const cookies = req.cookies
    if(!cookies?.jwt){
        return res.status(204).json({Success: false, message: 'no token'})
    } 
    const refreshToken:string = cookies.jwt
    await AuthService.logout(refreshToken)
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({
        Success: true,
        message: 'Logout Successful'
    })
})

export const refreshTokenHandler = 
catchAsync(async(
    req: Request, 
    res: Response<DefaultResponse & {accessToken?: string}>
) => {
    const ua = req.useragent
    const platform = ua?.isMobile ? 'Mobile' : ua?.isDesktop ? 'Desktop' : 'Tablet'
    const deviceName = `${ua?.browser} on ${ua?.os} (${platform})`
    const ip = req.ip || req.socket.remoteAddress
    const cookies = req. cookies
    if(!cookies?.jwt){
        return res.status(204).json({Success: false, message: 'no token'})
    }

    const oldToken = cookies.jwt
    try{
    
    const {accessToken, refreshToken, user} = await AuthService.token({oldToken, deviceName, ip})
    res.cookie(
        'jwt', refreshToken,
        {   
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    res.status(201).json({
        Success: true,
        message: 'Token refreshed',
        data: user,
        accessToken
    })
}catch(err: any){
    res.clearCookie('jwt', {httpOnly: true, secure: process.env.NODE_ENV === 'production'})
    throw err
}
}) 