import { ValidateCheckInUseCase } from '../validate-check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const validateCheckInUseCase = new ValidateCheckInUseCase(
    checkInsRepository,
    gymsRepository,
  )

  return validateCheckInUseCase
}
