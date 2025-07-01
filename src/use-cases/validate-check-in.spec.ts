import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

// unit test
let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase
let gymsRepository: InMemoryGymsRepository

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository, gymsRepository)
  })
  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })
  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)

    vi.useRealTimers()
  })
})
