import mongoose from 'mongoose'
import { TErrorSources } from './Error.interface'

const mongooseErrorHandler = (err: mongoose.Error.ValidationError) => {
  const statusCode = 400
  const message = 'Validation error'
  const ErrorSources: TErrorSources = Object.values(err.errors).map(
    (err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: err.path,
        message: err.message,
      }
    }
  )
  return {
    statusCode,
    message,
    ErrorSources,
  }
}
export default mongooseErrorHandler
