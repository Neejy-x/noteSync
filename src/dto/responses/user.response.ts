export interface NoteResponse {
title: string,
content: string
}

export interface UserDTO {
    user_id: string,
    username: string,
    email: string,
    role?: string
}