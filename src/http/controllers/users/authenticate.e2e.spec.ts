import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to authenticate a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.status).toBe(201)

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(authResponse.status).toBe(200)
    expect(authResponse.body).toEqual({
      token: expect.any(String),
    })
  })
})
