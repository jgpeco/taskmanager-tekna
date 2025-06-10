import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

interface AuthCredentials {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  userId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = '/auth'

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/login`, credentials).pipe(
      tap((response) => {
        console.log('Login: success!', response)
        localStorage.setItem('auth_token', response.token)

        this.snackBar.open('You have successfully signed in!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        })

        this.router.navigate(['/tasks'])
      }),
      catchError(this.handleError.bind(this))
    )
  }

  register(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/register`, credentials).pipe(
      tap((response) => {
        console.log('Register: success!', response)

        this.snackBar.open('You have successfully signed up! Please, login.', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        })

        this.router.navigate(['/login'])
      }),
      catchError(this.handleError.bind(this))
    )
  }

  logout(): void {
    localStorage.removeItem('auth_token')
    this.snackBar.open('User disconnected.', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    })
    this.router.navigate(['/login'])
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.'

    if (error.status >= 500 && error.status < 600) {
      this.router.navigate(['/server-error'])
      errorMessage = 'A server error occurred. Please try again later.'
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      })
      return throwError(() => new Error(errorMessage))
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
      this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      })
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body: ${JSON.stringify(error.error)}`
      )

      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Invalid credentials or access denied.'
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.'
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message
      } else {
        errorMessage = `Server error: ${error.status} - ${error.statusText || 'Error'}`
      }
      this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      })
    }

    return throwError(() => new Error(errorMessage))
  }
}
