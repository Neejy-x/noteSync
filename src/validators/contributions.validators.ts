import z from "zod";

export const postContributionInviteSchema = z.object({
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

export const getContributionsInvitesSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/, 'Page must be anumber').optional(),
        limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional()
    })
})

export const acceptContributionSchema = z.object({
    params: z.object({
        noteId: z.string().uuid({message: 'NoteID must be a valid ID'})
    })
})

export const declineContributionsSchema = z.object({
    params: z.object({
        noteId: z.string().uuid({message: 'Note ID must be a valid ID'})
    })
})