import z from "zod";

export const contributionInviteSchema = z.object({
    params: z.object({
        noteId: z.string().uuid({message: 'Invalid Note ID formate'})
    }),
    body: z.object({
        username: z.string()
        .min(3, 'username must be at least 3 charcters')
        .max(50, 'username canot be more than 50 characters'),
        permission: z.enum(['VEIWER', 'EDITOR']).default('VEIWER')
    })
})