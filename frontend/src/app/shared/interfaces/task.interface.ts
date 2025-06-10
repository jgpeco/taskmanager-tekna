export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: number
  title: string
  status: TaskStatus
  userId: number
  createdAt: string // ISO 8601 date string
}

export interface CreateTaskDto {
  title: string
  status: TaskStatus
}

export interface UpdateTaskDto {
  title?: string
  status?: TaskStatus
}
