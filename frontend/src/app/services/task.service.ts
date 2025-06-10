import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'

import { Task, CreateTaskDto, UpdateTaskDto } from '../shared/interfaces/task.interface'
import { handleApiError } from '../core/helpers/api-error.handler'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_BASE_URL = '/api'

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.API_BASE_URL}/tasks`)
      .pipe(
        catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
      )
  }

  getTaskById(id: number): Observable<Task> {
    return this.http
      .get<Task>(`${this.API_BASE_URL}/tasks/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
      )
  }

  createTask(taskData: CreateTaskDto): Observable<Task> {
    return this.http
      .post<Task>(`${this.API_BASE_URL}/tasks`, taskData)
      .pipe(
        catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
      )
  }

  updateTask(id: number, taskData: UpdateTaskDto): Observable<Task> {
    return this.http
      .put<Task>(`${this.API_BASE_URL}/tasks/${id}`, taskData)
      .pipe(
        catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
      )
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_BASE_URL}/tasks/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => handleApiError(error, this.snackBar, this.router))
      )
  }
}
