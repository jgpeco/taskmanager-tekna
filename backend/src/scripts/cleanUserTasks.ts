import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting task cleanup script...')

  const userEmailToClean = 'admin@example.com'

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmailToClean },
      select: { id: true, email: true }
    })

    if (!user) {
      console.log(`User with email ${userEmailToClean} not found. No tasks to delete.`)
      return
    }

    console.log(`Found user ${user.email} (ID: ${user.id}). Deleting their tasks...`)

    const deleteResult = await prisma.task.deleteMany({
      where: {
        userId: user.id
      }
    })

    console.log(`Successfully deleted ${deleteResult.count} tasks for user ${user.email}.`)
  } catch (error) {
    console.error('Error during task cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('Task cleanup script finished.')
  }
}

main()
