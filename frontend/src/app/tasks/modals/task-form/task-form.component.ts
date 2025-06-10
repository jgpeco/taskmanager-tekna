import { Component, Inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar } from '@angular/material/snack-bar'

import { TaskService } from '../../../services/task.service'
import { Task, TaskStatus, UpdateTaskDto } from '../../../shared/interfaces/task.interface'

export interface TaskFormDialogData {
  task?: Task
  isNew: boolean
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskForm: FormGroup
  taskStatuses = Object.values(TaskStatus)
  isNewTask: boolean
  currentTask: Task | undefined

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormDialogData
  ) {
    this.isNewTask = data.isNew
    this.currentTask = data.task

    this.taskForm = this.fb.group({
      title: [this.currentTask?.title || '', Validators.required],
      status: [this.currentTask?.status || TaskStatus.NEW, Validators.required]
    })
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched()
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      })
      return
    }

    const { title, status } = this.taskForm.value

    if (this.isNewTask) {
      console.log('create new')
    } else {
      if (this.currentTask) {
        const updateDto: UpdateTaskDto = { title, status }
        this.taskService.updateTask(this.currentTask.id, updateDto).subscribe({
          next: (updatedTask) => {
            this.snackBar.open(`Task ${updatedTask.title} updated successfully!`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            })
            this.dialogRef.close(true)
          },
          error: (err) => {
            this.dialogRef.close(false)
          }
        })
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }
}
