import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, BehaviorSubject } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { handleApiError } from '../core/helpers/api-error.handler'

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

  private authTokenSubject = new BehaviorSubject<string | null>(null)
  public authToken$ = this.authTokenSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      this.authTokenSubject.next(storedToken)
    }
  }

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/login`, credentials).pipe(
      tap((response) => {
        console.log('Login: success!', response)
        localStorage.setItem('auth_token', response.token)
        this.authTokenSubject.next(response.token)

        this.snackBar.open('You have successfully signed in!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        })

        this.router.navigate(['/tasks'])
      }),
      catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
    )
  }

  register(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/register`, credentials).pipe(
      tap((response) => {
        console.log('Register: success!', response)

        this.snackBar.open('You have successfully signed up! Please, login.', 'Close', {
          duration: 3000,
          panelClass: ['info-snackbar']
        })

        this.router.navigate(['/login'])
      }),
      catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
    )
  }

  logout(): void {
    localStorage.removeItem('auth_token')
    this.authTokenSubject.next(null)

    this.snackBar.open('User disconnected.', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    })
    this.router.navigate(['/login'])
  }

  isLoggedIn(): boolean {
    return this.authTokenSubject.value !== null
  }

  getToken(): string | null {
    return this.authTokenSubject.value
  }
}
