// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from '../../services/auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly NO_AUTH_URLS = ['/auth/login', '/auth/register']

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthDisabledRoute = this.NO_AUTH_URLS.some((url) => request.url.includes(url))

    if (isAuthDisabledRoute) {
      return next.handle(request)
    }

    const authToken = this.authService.getToken()

    if (authToken) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      })
      return next.handle(clonedRequest)
    }

    return next.handle(request)
  }
}
