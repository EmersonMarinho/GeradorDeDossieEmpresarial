export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      'INTERNAL_ERROR',
      500,
      { originalError: error.name }
    )
  }

  return new AppError(
    'An unexpected error occurred',
    'INTERNAL_ERROR',
    500,
    { originalError: error }
  )
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
} 