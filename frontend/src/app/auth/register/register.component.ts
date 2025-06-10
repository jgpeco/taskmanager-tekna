import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { RouterLink } from '@angular/router'
import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = ''
  password: string = ''

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Register realized in component:', response)
      },
      error: (err) => {
        console.error('Register error in component:', err)
      }
    })
  }
}
