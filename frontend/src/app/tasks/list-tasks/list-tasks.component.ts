import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common' // Necessário para ngIf, ngFor

// Angular Material Modules (importar aqui se o componente for standalone)
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatCardModule } from '@angular/material/card'

import { TaskService } from '../../services/task.service'
import { Task, TaskStatus } from '../../shared/interfaces/task.interface'

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  tasks: Task[] = []
  loading = false
  error: string | null = null

  displayedColumns: string[] = ['title', 'status', 'actions']

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks(): void {
    this.loading = true
    this.error = null
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data
        this.loading = false
        console.log('Tasks loaded:', this.tasks)
      },
      error: (err) => {
        this.loading = false
        this.error = 'Failed to load tasks. Please try again.'
        console.error('Error loading tasks:', err)
      }
    })
  }

  onEditTask(task: Task): void {
    console.log('Edit Task:', task)
    alert(`Editing task: ${task.title} (ID: ${task.id})`)
  }

  onDeleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          console.log(`Task ${task.id} deleted.`)
          this.loadTasks()
        },
        error: (err) => {
          console.error(`Error deleting task ${task.id}:`, err)
          this.error = 'Failed to delete task. Please try again.'
        }
      })
    }
  }

  formatStatus(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.NEW:
        return 'New'
      case TaskStatus.IN_PROGRESS:
        return 'In Progress'
      case TaskStatus.COMPLETED:
        return 'Completed'
      default:
        return status
    }
  }
}
