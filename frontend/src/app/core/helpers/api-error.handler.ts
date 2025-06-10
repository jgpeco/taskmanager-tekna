import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { throwError } from 'rxjs'

import { ZodErrorResponse } from '../../shared/interfaces/zod-error-response.interface'

export function handleApiError(error: HttpErrorResponse, snackBar: MatSnackBar, router: Router) {
  let errorMessage = 'An unknown error occurred.'

  if (error.status >= 500 && error.status < 600) {
    router.navigate(['/server-error'])
    errorMessage = 'A server error occurred. Please try again later.'
    snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    })
  } else if (error.error instanceof ErrorEvent) {
    errorMessage = `Error: ${error.error.message}`
    snackBar.open(`Error: ${errorMessage}`, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    })
  } else {
    console.error(
      `Backend returned code ${error.status}, ` + `body: ${JSON.stringify(error.error)}`
    )

    if (
      error.status === 400 &&
      error.error &&
      typeof error.error === 'object' &&
      'errors' in error.error
    ) {
      const zodError = error.error as ZodErrorResponse
      let detailedMessage = ''

      if (zodError.errors._errors && zodError.errors._errors.length > 0) {
        detailedMessage += zodError.errors._errors.join(', ')
      }

      for (const key in zodError.errors) {
        if (key !== '_errors' && zodError.errors.hasOwnProperty(key)) {
          const fieldErrors = (zodError.errors as any)[key]?._errors
          if (fieldErrors && fieldErrors.length > 0) {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
            detailedMessage +=
              (detailedMessage ? '\n' : '') + `${formattedKey}: ${fieldErrors.join(', ')}`
          }
        }
      }

      if (detailedMessage) {
        errorMessage = detailedMessage
      } else {
        errorMessage = 'Validation error occurred.'
      }
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'Invalid credentials or access denied.'
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.'
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Server error: ${error.status} - ${error.statusText || 'Error'}`
    }

    snackBar.open(`Error: ${errorMessage}`, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    })
  }

  return throwError(() => new Error(errorMessage))
}
