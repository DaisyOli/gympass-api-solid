import { Gym, Prisma } from '@prisma/client'

export interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export interface CreateGymUseCaseResponse {
  gym: Gym
}

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchManyByTitle(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}
