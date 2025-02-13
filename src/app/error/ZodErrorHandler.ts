import { ZodError } from 'zod'
import { TErrorSources } from './Error.interface'

const ZodErrorHandler = (err: ZodError) => {
  const statusCode = 400
  const message = 'Validation error'

  const ErrorSources: TErrorSources = err.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  return {
    statusCode,
    message,
    ErrorSources,
  }
}

export default ZodErrorHandler
