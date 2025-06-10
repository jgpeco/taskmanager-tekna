import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router' // Para a funcionalidade de "voltar"

// Angular Material Imports
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  constructor(private router: Router) {}
  goBack(): void {
    history.back()
  }
}
