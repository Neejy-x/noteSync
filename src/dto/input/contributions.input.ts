import z from "zod";
import { getContributionsInvitesSchema, postContributionInviteSchema } from "../../validators/contributions.validators";

export type contributionsInviteType = z.infer<typeof postContributionInviteSchema>

export type getContributionsInvitesInput = z.infer<typeof getContributionsInvitesSchema>