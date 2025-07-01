import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to search for gyms', async () => {
    const { token } = await createAndAuthenticateUser()

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const searchResponse = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(searchResponse.status).toBe(200)
    expect(searchResponse.body.gyms).toHaveLength(1)
    expect(searchResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
