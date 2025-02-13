/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources } from '../error/Error.interface'

const DuplicateIDErrorHandler = (err: any) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/)

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1]
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is not a already existing`,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    success: false,
    message: 'Validation error',
    errorSources,
  }
}

export default DuplicateIDErrorHandler
