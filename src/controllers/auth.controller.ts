import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserDTO } from '../dto/responses/user.response';
import { loginInput, SignUpInput } from '../validators/auth.validators';



export const signUpHandler = async (
    req: Request<{}, {}, SignUpInput>,
    res: Response<{Success: boolean, message: string, data: UserDTO, accessToken: string}>
) => {
    const {username, password, email} = req.body;
    const {user, accessToken, refreshToken} = await AuthService.signUp({username, password, email})
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
}

export const loginHandler = async(
    req: Request<{}, {}, loginInput>, 
    res:Response<{Success: boolean, message: string, data: UserDTO, accessToken: string}>
) => {
    const {username, password} = req.body
    const {user, accessToken, refreshToken} = await AuthService.login({username, password})

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

}

export const logoutHandler = async(req:Request, res:Response<{Success: boolean, message: string}>) => {
    const cookies = req.cookies
    if(!cookies?.jwt){
        return res.status(204).json({Success: false, message: 'not token'})
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
}