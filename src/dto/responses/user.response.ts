export interface NoteResponse {
title: string,
content: string
}

export interface UserDTO {
    user_id: number,
    username: string,
    email: string,
    role?: string
}