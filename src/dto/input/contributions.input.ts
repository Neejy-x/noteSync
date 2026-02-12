import z from "zod";
import { contributionInviteSchema } from "../../validators/contributions.validators";

export type contributionsInviteType = z.infer<typeof contributionInviteSchema>