import { PrismaClient } from '@prisma/client'
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

  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'New task',
        status: 'NEW',
        userId: user.id
      },
      {
        title: 'Task in progress',
        status: 'IN_PROGRESS',
        userId: user.id
      },
      {
        title: 'Task completed',
        status: 'COMPLETED',
        userId: user.id
      }
    ]
  })

  console.log('Seed complete:', { user, tasks })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
