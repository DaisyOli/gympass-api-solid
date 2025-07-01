import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to validate the check-in', async () => {
    const { token } = await createAndAuthenticateAdmin()

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: 'admin@example.com',
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(204)
    const updatedCheckIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })
    expect(updatedCheckIn.validated_at).toEqual(expect.any(Date))
  })
})
