import { Details } from 'express-useragent';

declare global {
    namespace Express {
        interface Request {
            useragent?: userAgent.Details;
        }
    }
}