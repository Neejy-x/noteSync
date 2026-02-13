import z from "zod";
import { acceptContributionSchema, getContributionsInvitesSchema, postContributionInviteSchema } from "../../validators/contributions.validators";

export type contributionsInviteType = z.infer<typeof postContributionInviteSchema>

export type getContributionsInvitesInput = z.infer<typeof getContributionsInvitesSchema>

export type acceptContributionsInput = z.infer<typeof acceptContributionSchema>