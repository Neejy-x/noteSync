import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserDTO } from '../dto/responses/user.response';
import { SignUpInput } from '../validators/auth.validators';



export const signUpHandler = async (
    req: Request<{}, {}, SignUpInput>,
    res: Response<{Success: boolean, message: string, data: UserDTO, accessToken: string}>
) => {
    const {username, password, email} = req.body;
    const {user, accessToken, refreshToken} = await AuthService.signUp({username, password, email})
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
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