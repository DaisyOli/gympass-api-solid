import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import dayjs from 'dayjs'

interface ValidateCheckInRequest {
  checkInId: string
}

interface ValidateCheckInResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    checkInId,
  }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs().diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
