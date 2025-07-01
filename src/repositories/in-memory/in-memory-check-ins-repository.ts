import { User, Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const userCheckIns = this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return userCheckIns
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find((item) => item.id === id)
    return checkIn || null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(data: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((item) => item.id === data.id)
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = data
    }
    return data
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const checkInOnSameDate = this.items.find((item) => {
      const checkInDate = item.created_at.toDateString()
      return item.user_id === userId && checkInDate === date.toDateString()
    })
    return checkInOnSameDate || null
  }
}
