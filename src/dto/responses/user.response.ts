export interface NoteResponse {
title: string,
content: string
}

export interface UserDTO {
    id: number,
    username: string,
    email: string,
    role?: string
}