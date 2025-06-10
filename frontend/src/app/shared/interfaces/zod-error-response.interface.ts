export interface ZodErrorResponse {
  errors: {
    _errors: string[]
    [key: string]: { _errors: string[] } | string[]
  }
}
