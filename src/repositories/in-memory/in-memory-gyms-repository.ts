import { Prisma, Gym } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)
    return gym || null
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    }

    this.items.push(gym)

    return gym
  }

  async searchManyByTitle(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: item.latitude, longitude: item.longitude },
      )

      return distance < 10
    })
  }
}
