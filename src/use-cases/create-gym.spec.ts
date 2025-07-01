import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { beforeEach, describe, expect, it } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: 'Some description',
      phone: '1234567890',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(gymsRepository.items).toHaveLength(1)
    expect(gymsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '1234567890',
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
    )
    expect(gym.id).toEqual(expect.any(String))
  })
})
