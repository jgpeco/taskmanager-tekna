import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const snackBar = inject(MatSnackBar)

  if (authService.isLoggedIn()) {
    return true
  } else {
    snackBar.open('You must be logged in to access this page.', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    })
    router.navigate(['/login'])
    return false
  }
}
