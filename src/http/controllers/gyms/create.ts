import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90 // latitude is a number between -90 and 90
    }, 'Latitude must be between -90 and 90'),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180 // longitude is a number between -180 and 180
    }, 'Longitude must be between -180 and 180'),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
