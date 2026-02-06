export interface NoteResponse {
title: string,
content: string,
update_at: Date
}

export interface UserDTO {
    user_id: string,
    username: string,
    email: string,
    role?: string
}

export interface DefaultResponse{
    Success: boolean;
    message: string;
    data?: {}
}