import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    })
    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: dayjs(date).startOf('day').toDate(),
          lte: dayjs(date).endOf('day').toDate(),
        },
      },
    })
    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      skip: (page - 1) * 20,
      take: 20,
    })
    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: { user_id: userId },
    })
    return count
  }

  async save(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })
    return checkIn
  }
}
