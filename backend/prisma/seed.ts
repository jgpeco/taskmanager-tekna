import { PrismaClient, Status } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed.ts')

  const hashedPassword = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword
    }
  })

  console.log('User upserted:', user.email)

  const initialTasksData = [
    { title: 'New task', status: Status.NEW, userId: user.id },
    { title: 'Task in progress', status: Status.IN_PROGRESS, userId: user.id },
    { title: 'Task completed', status: Status.COMPLETED, userId: user.id }
  ]

  const existingTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      title: {
        in: initialTasksData.map((task) => task.title)
      }
    },
    select: { title: true }
  })

  const existingTaskTitles = new Set(existingTasks.map((task) => task.title))

  const tasksToCreate = initialTasksData.filter((task) => !existingTaskTitles.has(task.title))

  let createdTasksResult
  if (tasksToCreate.length > 0) {
    createdTasksResult = await prisma.task.createMany({
      data: tasksToCreate
    })
    console.log(`Created ${createdTasksResult.count} new tasks.`)
  } else {
    console.log('No new tasks to create. All initial tasks already exist.')
  }

  console.log('Seed complete for user:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
