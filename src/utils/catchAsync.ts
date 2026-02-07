
export const catchAsync = (fn: Function) => {
    return (req: any, res: any, next: any) => {
        fn(req, res, next).catch(next);
    };
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: string;
      };
    }
  }
}