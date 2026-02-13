import z from "zod";
import { acceptContributionSchema, declineContributionsSchema, getContributionsInvitesSchema, postContributionInviteSchema } from "../../validators/contributions.validators";

export type contributionsInviteType = z.infer<typeof postContributionInviteSchema>

export type getContributionsInvitesInput = z.infer<typeof getContributionsInvitesSchema>

export type acceptContributionsInviteInput = z.infer<typeof acceptContributionSchema>

export type declineContributionsInviteInput = z.infer<typeof declineContributionsSchema>