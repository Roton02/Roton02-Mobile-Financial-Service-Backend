import { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload // ✅ Now TypeScript knows that `req.user` exists
  }
}
