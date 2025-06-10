import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent {
  // Fetching and display tasks will go here later
}
