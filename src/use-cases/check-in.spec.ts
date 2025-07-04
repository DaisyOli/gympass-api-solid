import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
// unit test
let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase
let gymsRepository: InMemoryGymsRepository

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
  })
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.useFakeTimers()

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    await expect(
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should not be able to check in twice but in different days', async () => {
    vi.useFakeTimers()

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    await expect(
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).resolves.toBeTruthy()
  })
  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-2',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await expect(
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
