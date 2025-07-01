import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { GymsRepository, FindManyNearbyParams } from '../gyms-repository'

const MAX_DISTANCE_IN_KILOMETERS = 10

type Gym = {
  id: string
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}
export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })
    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })
    return gym
  }

  async searchManyByTitle(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: { title: { contains: query } },
      skip: (page - 1) * 20,
      take: 20,
    })
    return gyms
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE (6371 * acos(cos(radians(${params.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${params.longitude})) + sin(radians(${params.latitude})) * sin(radians(latitude)))) <= ${MAX_DISTANCE_IN_KILOMETERS}
    `
    return gyms
  }

  async searchManyNearby(params: FindManyNearbyParams) {
    const gyms = await prisma.gym.findMany({
      where: {
        latitude: {
          gte: params.latitude - 0.1,
          lte: params.latitude + 0.1,
        },
        longitude: { gte: params.longitude - 0.1, lte: params.longitude + 0.1 },
      },
    })
    return gyms
  }

  async save(data: Prisma.GymUncheckedCreateInput) {
    const gym = await prisma.gym.update({
      where: { id: data.id },
      data,
    })
    return gym
  }
}
